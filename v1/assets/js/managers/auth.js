// Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authToken = null;
        this.refreshTimer = null;
        
        this.init();
    }

    // Initialize authentication state
    async init() {
        try {
            // Check if user is already authenticated
            this.authToken = AuthStore.getToken();
            
            if (this.authToken) {
                await this.loadUserProfile();
                this.startTokenRefresh();
            }
            
            this.setupEventListeners();
        } catch (error) {
            console.error('Auth init error:', error);
            this.logout();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for auth events
        Utils.events.on('auth:login', (data) => this.handleLoginSuccess(data));
        Utils.events.on('auth:logout', () => this.handleLogout());
        Utils.events.on('auth:token-expired', () => this.handleTokenExpired());
        
        // Setup form listeners
        this.setupLoginForm();
        this.setupRegisterForm();
    }

    // Setup login form
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin(e);
            });
        }
    }

    // Setup register form
    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister(e);
            });
        }
    }

    // Handle login form submission
    async handleLogin(event) {
        const form = event.target;
        const formData = new FormData(form);
        
        // Validate form
        const validation = UI.Validation.validate(form);
        if (!validation.isValid) {
            UI.Toast.error('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring');
            return;
        }

        const credentials = {
            login: document.getElementById('loginInput').value.trim(),
            password: document.getElementById('passwordInput').value
        };

        // Basic validation
        if (!credentials.login || !credentials.password) {
            UI.Toast.error('Login va parolni kiriting');
            return;
        }

        try {
            UI.Loading.show('Kirilmoqda...');
            
            const response = await API.auth.login(credentials);
            
            if (response.success) {
                await this.processAuthResponse(response);
                UI.Toast.success(Config.SUCCESS.LOGIN);
                UI.Modal.hide('loginModal');
                
                // Reset form
                form.reset();
                
                // Redirect or update UI
                this.handlePostLogin();
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            UI.Toast.error(error.message || 'Kirish xatoligi');
        } finally {
            UI.Loading.hide();
        }
    }

    // Handle register form submission
    async handleRegister(event) {
        const form = event.target;
        
        // Validate form
        const validation = UI.Validation.validate(form);
        if (!validation.isValid) {
            UI.Toast.error('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring');
            return;
        }

        const userData = {
            name: document.getElementById('nameInput').value.trim(),
            email: document.getElementById('emailInput').value.trim(),
            phone: document.getElementById('phoneInput').value.trim(),
            password: document.getElementById('newPasswordInput').value,
            password_confirmation: document.getElementById('confirmPasswordInput').value
        };

        // Additional validation
        if (userData.password !== userData.password_confirmation) {
            UI.Toast.error('Parollar mos kelmaydi');
            return;
        }

        if (userData.password.length < 6) {
            UI.Toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
            return;
        }

        if (!Utils.isValidEmail(userData.email)) {
            UI.Toast.error('Email manzilni to\'g\'ri kiriting');
            return;
        }

        if (!Utils.isValidPhone(userData.phone)) {
            UI.Toast.error('Telefon raqamni to\'g\'ri kiriting');
            return;
        }

        try {
            UI.Loading.show('Ro\'yxatdan o\'tilmoqda...');
            
            const response = await API.auth.register(userData);
            
            if (response.success) {
                await this.processAuthResponse(response);
                UI.Toast.success(Config.SUCCESS.REGISTER);
                UI.Modal.hide('registerModal');
                
                // Reset form
                form.reset();
                
                // Redirect or update UI
                this.handlePostLogin();
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Register error:', error);
            UI.Toast.error(error.message || 'Ro\'yxatdan o\'tish xatoligi');
        } finally {
            UI.Loading.hide();
        }
    }

    // Process authentication response
    async processAuthResponse(response) {
        const { token, user } = response.data;
        
        this.authToken = token;
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Store in secure storage
        AuthStore.setToken(token);
        AuthStore.setUser(user);
        
        // Start token refresh
        this.startTokenRefresh();
        
        // Emit auth event
        Utils.events.emit('auth:login', { user, token });
        
        // Update UI
        this.updateAuthUI();
    }

    // Load user profile
    async loadUserProfile() {
        try {
            const response = await API.auth.me();
            
            if (response.success) {
                this.currentUser = response.data.user;
                this.isAuthenticated = true;
                AuthStore.setUser(this.currentUser);
                this.updateAuthUI();
            } else {
                throw new Error('Failed to load user profile');
            }
        } catch (error) {
            console.error('Load profile error:', error);
            throw error;
        }
    }

    // Handle successful login
    handleLoginSuccess(data) {
        // Load cart count and other user-specific data
        if (window.CartManager) {
            CartManager.loadCartCount();
        }
        
        // Update navigation
        this.updateNavigation();
    }

    // Handle post-login actions
    handlePostLogin() {
        // Redirect to intended page or dashboard
        const intendedPage = SettingsStore.get('intended_page');
        if (intendedPage) {
            SettingsStore.remove('intended_page');
            Router.navigate(intendedPage);
        } else {
            // Default redirect
            Router.navigate('home');
        }
    }

    // Handle logout
    async logout() {
        try {
            // Call logout API if authenticated
            if (this.isAuthenticated && this.authToken) {
                await API.auth.logout();
            }
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            this.handleLogout();
        }
    }

    // Handle logout cleanup
    handleLogout() {
        // Clear auth data
        this.authToken = null;
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Clear storage
        AuthStore.clearAuth();
        
        // Clear cart data
        if (window.CartManager) {
            CartManager.clearLocalCart();
        }
        
        // Stop token refresh
        this.stopTokenRefresh();
        
        // Emit logout event
        Utils.events.emit('auth:logout');
        
        // Update UI
        this.updateAuthUI();
        
        // Show success message
        UI.Toast.success(Config.SUCCESS.LOGOUT);
        
        // Redirect to home
        Router.navigate('home');
    }

    // Handle token expiration
    handleTokenExpired() {
        UI.Toast.warning('Sessiya tugadi. Iltimos, qayta kiring');
        this.handleLogout();
    }

    // Start token refresh timer
    startTokenRefresh() {
        this.stopTokenRefresh();
        
        // Refresh token every 50 minutes (assuming 1-hour expiry)
        this.refreshTimer = setInterval(async () => {
            try {
                await this.refreshToken();
            } catch (error) {
                console.error('Token refresh error:', error);
                this.handleTokenExpired();
            }
        }, 50 * 60 * 1000);
    }

    // Stop token refresh timer
    stopTokenRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    // Refresh authentication token
    async refreshToken() {
        try {
            const response = await API.auth.me();
            if (response.success) {
                // Token is still valid
                return true;
            } else {
                throw new Error('Token invalid');
            }
        } catch (error) {
            throw error;
        }
    }

    // Update authentication UI
    updateAuthUI() {
        // Update cart badge
        this.updateCartBadge();
        
        // Update profile display
        this.updateProfileDisplay();
        
        // Update navigation items
        this.updateNavigation();
    }

    // Update cart badge
    updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge && window.CartManager) {
            CartManager.updateCartBadge();
        }
    }

    // Update profile display
    updateProfileDisplay() {
        const profileElements = document.querySelectorAll('[data-auth-user]');
        
        profileElements.forEach(element => {
            const field = element.dataset.authUser;
            if (this.currentUser && this.currentUser[field]) {
                element.textContent = this.currentUser[field];
            } else {
                element.textContent = '';
            }
        });
    }

    // Update navigation based on auth state
    updateNavigation() {
        const authElements = document.querySelectorAll('[data-auth-required]');
        const guestElements = document.querySelectorAll('[data-guest-only]');
        
        authElements.forEach(element => {
            element.style.display = this.isAuthenticated ? 'block' : 'none';
        });
        
        guestElements.forEach(element => {
            element.style.display = this.isAuthenticated ? 'none' : 'block';
        });
    }

    // Show login modal
    showLogin() {
        UI.Modal.hide('registerModal');
        UI.Modal.show('loginModal');
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = document.querySelector('#loginModal input');
            if (firstInput) firstInput.focus();
        }, 300);
    }

    // Show register modal
    showRegister() {
        UI.Modal.hide('loginModal');
        UI.Modal.show('registerModal');
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = document.querySelector('#registerModal input');
            if (firstInput) firstInput.focus();
        }, 300);
    }

    // Check if user is authenticated
    checkAuth() {
        return this.isAuthenticated && this.currentUser && this.authToken;
    }

    // Require authentication for protected actions
    requireAuth(callback, redirectPage = null) {
        if (this.checkAuth()) {
            callback();
        } else {
            // Store intended page for redirect after login
            if (redirectPage) {
                SettingsStore.set('intended_page', redirectPage);
            }
            
            UI.Toast.warning('Bu amalni bajarish uchun tizimga kirish kerak');
            this.showLogin();
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get auth token
    getToken() {
        return this.authToken;
    }

    // Check if user has specific role/permission
    hasRole(role) {
        if (!this.currentUser || !this.currentUser.roles) {
            return false;
        }
        
        return this.currentUser.roles.includes(role);
    }

    // Check if user has specific permission
    hasPermission(permission) {
        if (!this.currentUser || !this.currentUser.permissions) {
            return false;
        }
        
        return this.currentUser.permissions.includes(permission);
    }

    // Update user profile
    async updateProfile(profileData) {
        try {
            UI.Loading.show('Profil yangilanmoqda...');
            
            const response = await API.profile.update(profileData);
            
            if (response.success) {
                this.currentUser = { ...this.currentUser, ...response.data.user };
                AuthStore.setUser(this.currentUser);
                
                UI.Toast.success('Profil muvaffaqiyatli yangilandi');
                this.updateAuthUI();
                
                return response;
            } else {
                throw new Error(response.message || 'Profile update failed');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            UI.Toast.error(error.message || 'Profil yangilashda xatolik');
            throw error;
        } finally {
            UI.Loading.hide();
        }
    }

    // Change password
    async changePassword(passwordData) {
        try {
            // Validate password data
            if (!passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirmation) {
                throw new Error('Barcha maydonlarni to\'ldiring');
            }
            
            if (passwordData.new_password !== passwordData.new_password_confirmation) {
                throw new Error('Yangi parollar mos kelmaydi');
            }
            
            if (passwordData.new_password.length < 6) {
                throw new Error('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak');
            }
            
            UI.Loading.show('Parol o\'zgartirilmoqda...');
            
            const response = await API.profile.changePassword(passwordData);
            
            if (response.success) {
                UI.Toast.success('Parol muvaffaqiyatli o\'zgartirildi');
                return response;
            } else {
                throw new Error(response.message || 'Password change failed');
            }
        } catch (error) {
            console.error('Password change error:', error);
            UI.Toast.error(error.message || 'Parol o\'zgartirishda xatolik');
            throw error;
        } finally {
            UI.Loading.hide();
        }
    }

    // Upload avatar
    async uploadAvatar(file) {
        try {
            // Validate file
            if (!file) {
                throw new Error('Fayl tanlanmagan');
            }
            
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('Fayl hajmi 5MB dan oshmasligi kerak');
            }
            
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Faqat JPG, PNG yoki GIF formatdagi fayllar qabul qilinadi');
            }
            
            UI.Loading.show('Rasm yuklanmoqda...');
            
            const response = await API.profile.uploadAvatar(file, (progress) => {
                UI.Loading.updateMessage(`Yuklanmoqda... ${Math.round(progress)}%`);
            });
            
            if (response.success) {
                this.currentUser.avatar = response.data.avatar_url;
                AuthStore.setUser(this.currentUser);
                
                UI.Toast.success('Avatar muvaffaqiyatli yangilandi');
                this.updateAuthUI();
                
                return response;
            } else {
                throw new Error(response.message || 'Avatar upload failed');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            UI.Toast.error(error.message || 'Avatar yuklashda xatolik');
            throw error;
        } finally {
            UI.Loading.hide();
        }
    }

    // Delete avatar
    async deleteAvatar() {
        try {
            const confirmed = confirm('Avatarni o\'chirishni xohlaysizmi?');
            if (!confirmed) return;
            
            UI.Loading.show('Avatar o\'chirilmoqda...');
            
            const response = await API.profile.deleteAvatar();
            
            if (response.success) {
                this.currentUser.avatar = null;
                AuthStore.setUser(this.currentUser);
                
                UI.Toast.success('Avatar o\'chirildi');
                this.updateAuthUI();
                
                return response;
            } else {
                throw new Error(response.message || 'Avatar delete failed');
            }
        } catch (error) {
            console.error('Avatar delete error:', error);
            UI.Toast.error(error.message || 'Avatar o\'chirishda xatolik');
            throw error;
        } finally {
            UI.Loading.hide();
        }
    }

    // Delete account
    async deleteAccount(confirmationData) {
        try {
            // Validate confirmation
            if (!confirmationData.password) {
                throw new Error('Parolni kiriting');
            }
            
            if (!confirmationData.confirmation || confirmationData.confirmation.toLowerCase() !== 'delete') {
                throw new Error('Tasdiqlash uchun "DELETE" so\'zini kiriting');
            }
            
            const confirmed = confirm('Haqiqatan ham akkauntni o\'chirishni xohlaysizmi? Bu amalni bekor qilib bo\'lmaydi!');
            if (!confirmed) return;
            
            UI.Loading.show('Akkaunt o\'chirilmoqda...');
            
            const response = await API.profile.deleteAccount(confirmationData);
            
            if (response.success) {
                UI.Toast.success('Akkaunt muvaffaqiyatli o\'chirildi');
                this.handleLogout();
                
                return response;
            } else {
                throw new Error(response.message || 'Account deletion failed');
            }
        } catch (error) {
            console.error('Account deletion error:', error);
            UI.Toast.error(error.message || 'Akkauntni o\'chirishda xatolik');
            throw error;
        } finally {
            UI.Loading.hide();
        }
    }

    // Get user statistics
    async getUserStatistics() {
        try {
            const response = await API.profile.getStatistics();
            
            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to load statistics');
            }
        } catch (error) {
            console.error('Statistics error:', error);
            return null;
        }
    }

    // Social login (placeholder for future implementation)
    async socialLogin(provider, token) {
        try {
            UI.Loading.show('Kirish...');
            
            // Implement social login API call
            // const response = await API.auth.socialLogin(provider, token);
            
            UI.Toast.info('Social login will be implemented soon');
        } catch (error) {
            console.error('Social login error:', error);
            UI.Toast.error('Social login xatoligi');
        } finally {
            UI.Loading.hide();
        }
    }

    // Password reset (placeholder for future implementation)
    async requestPasswordReset(email) {
        try {
            // Validate email
            if (!Utils.isValidEmail(email)) {
                throw new Error('Email manzilni to\'g\'ri kiriting');
            }
            
            UI.Loading.show('Yuborilmoqda...');
            
            // Implement password reset API call
            // const response = await API.auth.requestPasswordReset(email);
            
            UI.Toast.success('Parolni tiklash bo\'yicha xabar emailga yuborildi');
        } catch (error) {
            console.error('Password reset error:', error);
            UI.Toast.error(error.message || 'Parolni tiklashda xatolik');
        } finally {
            UI.Loading.hide();
        }
    }

    // Email verification (placeholder for future implementation)
    async verifyEmail(token) {
        try {
            UI.Loading.show('Tasdiqlanmoqda...');
            
            // Implement email verification API call
            // const response = await API.auth.verifyEmail(token);
            
            UI.Toast.success('Email muvaffaqiyatli tasdiqlandi');
        } catch (error) {
            console.error('Email verification error:', error);
            UI.Toast.error('Email tasdiqlanmadi');
        } finally {
            UI.Loading.hide();
        }
    }

    // Two-factor authentication setup (placeholder for future implementation)
    async setupTwoFactor() {
        try {
            UI.Loading.show('Sozlanmoqda...');
            
            // Implement 2FA setup
            UI.Toast.info('2FA setup will be implemented soon');
        } catch (error) {
            console.error('2FA setup error:', error);
            UI.Toast.error('2FA sozlashda xatolik');
        } finally {
            UI.Loading.hide();
        }
    }

    // Session management
    getSessionInfo() {
        return {
            isAuthenticated: this.isAuthenticated,
            user: this.currentUser,
            token: this.authToken ? this.authToken.substring(0, 10) + '...' : null,
            loginTime: AuthStore.get('login_time'),
            lastActivity: SettingsStore.getLastVisit()
        };
    }

    // Debug methods for development
    debug() {
        if (Config.APP.DEBUG) {
            console.log('Auth Manager State:', {
                isAuthenticated: this.isAuthenticated,
                user: this.currentUser,
                tokenExists: !!this.authToken,
                refreshTimer: !!this.refreshTimer
            });
        }
    }
}

// Create and export global instance
const AuthManager = new AuthManager();

// Make globally available
window.AuthManager = AuthManager;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}