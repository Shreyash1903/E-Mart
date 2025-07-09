from django.urls import path
from .views import RegisterView, ProductListView, UserProfileView, UpdatePasswordView, CreateOrderView , AddressListCreateView, AddressUpdateDeleteView, UserOrdersView, ProductDetailView , RazorpayOrderCreateView , GoogleSignupAPIView , GoogleLoginAPIView , SendOTPView, VerifyOTPView, ResetPasswordView , BrandListView , CartView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Products
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product_detail'),

    # Profile
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('update-password/', UpdatePasswordView.as_view(), name='update_password'),

    # Addresses - list/create and update/delete
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', AddressUpdateDeleteView.as_view(), name='address-update-delete'),

    path('razorpay/create-order/', RazorpayOrderCreateView.as_view(), name='create_razorpay_order'),
    
    # Orders
    path('orders/', UserOrdersView.as_view(), name='user_orders'),  # <-- add this line
    path('orders/create/', CreateOrderView.as_view(), name='create_order'),  # ✅ ADD THIS

    # Google Authentication
    path("auth/google-signup/", GoogleSignupAPIView.as_view(), name="google-signup"),
    path("auth/google-login/", GoogleLoginAPIView.as_view(), name="google-login"),

    # Password Reset OTP
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),

    # Verify OTP
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),

    # Reset Password
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),

    # Brands
    path('brands/', BrandListView, name='brand-list'),

    path('cart/', CartView.as_view(), name='user-cart'),
]
