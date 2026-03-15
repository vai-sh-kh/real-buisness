/**
 * Admin Login test suite
 *
 * Covers: correct credentials, wrong credentials, validation (empty submit,
 * invalid email, short password, max lengths), network/server errors,
 * submit disabled state, redirect param, and auth state edge cases.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLoginPage from "./page";
import { useAuthStore } from "@/store/authStore";

const mockReplace = vi.fn();
const mockGet = vi.fn();

// Stable reference so useEffect([searchParams]) does not loop when redirect is set
const searchParamsStable = { get: (key: string) => mockGet(key) };

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => searchParamsStable,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

function renderLogin() {
  return render(<AdminLoginPage />);
}

describe("Admin Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().clearAuth();
    mockGet.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  function getPasswordInput() {
    return document.getElementById("password") as HTMLInputElement;
  }

  async function waitForForm() {
    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
      expect(getPasswordInput()).toBeInTheDocument();
    });
  }

  describe("successful login with correct credentials", () => {
    it("logs in with correct email and password and redirects to dashboard", async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, email: "admin@example.com" }),
      });

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "admin@example.com");
      await user.type(getPasswordInput(), "secret123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "admin@example.com",
            password: "secret123",
          }),
        });
      });

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Welcome back!");
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().email).toBe("admin@example.com");
      expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
    });

    it("redirects to redirect param when provided after successful login", async () => {
      const user = userEvent.setup();
      mockGet.mockImplementation((key: string) =>
        key === "redirect" ? "/admin/leads" : null
      );
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, email: "admin@example.com" }),
      });

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "admin@example.com");
      await user.type(getPasswordInput(), "secret123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/admin/leads");
      });
    });
  });

  describe("login with wrong credentials", () => {
    it("shows error toast and does not redirect when credentials are wrong", async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Please check your email and password",
        }),
      });

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
      await user.type(getPasswordInput(), "wrongpass");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Please check your email and password"
        );
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("shows generic login failed when server returns no error message", async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "a@b.com");
      await user.type(getPasswordInput(), "password1");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Login failed");
      });
    });
  });

  describe("validation when submitting without entering credentials", () => {
    it("shows validation for empty email and password when submit without entering anything", async () => {
      const user = userEvent.setup();

      renderLogin();
      await waitForForm();

      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/please enter your email/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/please enter your password/i)
        ).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("shows validation for invalid email format", async () => {
      const user = userEvent.setup();

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "not-an-email");
      await user.type(getPasswordInput(), "validpass123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email address/i)
        ).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("shows validation when password is too short (less than 6 characters)", async () => {
      const user = userEvent.setup();

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "admin@example.com");
      await user.type(getPasswordInput(), "12345");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/please use at least 6 characters for password/i)
        ).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("shows validation when email exceeds 255 characters", async () => {
      const user = userEvent.setup();
      const longEmail =
        "a".repeat(250) + "@example.com";

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), longEmail);
      await user.type(getPasswordInput(), "validpass123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/please keep email to 255 characters or less/i)
        ).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("shows validation when password exceeds 128 characters", async () => {
      const user = userEvent.setup();
      const longPassword = "a".repeat(129);

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "admin@example.com");
      await user.type(getPasswordInput(), longPassword);
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/please keep password to 128 characters or less/i)
        ).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("network and server errors", () => {
    it("shows network error toast when fetch throws", async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network failure"));

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "admin@example.com");
      await user.type(getPasswordInput(), "secret123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Network error. Please try again."
        );
      });

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("shows server error message when API returns 500", async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Server configuration error",
        }),
      });

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "admin@example.com");
      await user.type(getPasswordInput(), "secret123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Server configuration error");
      });

      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe("submit button and loading state", () => {
    it("disables submit button and shows signing in text while submitting", async () => {
      const user = userEvent.setup();
      let resolveRequest: (value: unknown) => void = () => {};
      const fetchPromise = new Promise<unknown>((resolve) => {
        resolveRequest = resolve;
      });
      global.fetch = vi.fn().mockReturnValue(
        fetchPromise.then(() => ({
          ok: true,
          json: async () => ({ success: true, email: "admin@example.com" }),
        }))
      );

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "admin@example.com");
      await user.type(getPasswordInput(), "secret123");
      const submitBtn = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /signing in/i })
        ).toBeInTheDocument();
      });

      const button = screen.getByRole("button", { name: /signing in/i });
      expect(button).toBeDisabled();

      resolveRequest(undefined);
      // Allow async state updates to flush (submit completion)
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe("redirect and auth edge cases", () => {
    it("sanitizes redirect to admin path when redirect param is non-admin", async () => {
      const user = userEvent.setup();
      mockGet.mockImplementation((key: string) =>
        key === "redirect" ? "https://evil.com" : null
      );
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, email: "admin@example.com" }),
      });

      renderLogin();
      await waitForForm();

      await user.type(screen.getByLabelText(/email/i), "admin@example.com");
      await user.type(getPasswordInput(), "secret123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
      });
    });
  });

  describe("form accessibility and UX", () => {
    it("renders email and password inputs with correct labels", async () => {
      renderLogin();
      await waitForForm();

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const passwordInput = document.getElementById("password");

      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("autocomplete", "email");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("has back to site link", async () => {
      renderLogin();
      await waitForForm();

      const backLink = screen.getByRole("link", { name: /back to site/i });
      expect(backLink).toHaveAttribute("href", "/");
    });
  });
});
