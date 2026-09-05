package com.casehaven.shop.dto;

import com.casehaven.shop.model.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CheckoutRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    private String customerEmail;

    @NotBlank(message = "Customer phone number is required")
    private String customerPhone;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "City or Province is required")
    private String city;

    private String province;
    private String district;
    private String commune;
    private String couponCode;

    private String notes;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String currency = "USD";

    @NotEmpty(message = "Cart must contain at least one item")
    @Valid
    private List<CheckoutItemDto> items;

    public CheckoutRequest() {}

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getCommune() { return commune; }
    public void setCommune(String commune) { this.commune = commune; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public List<CheckoutItemDto> getItems() { return items; }
    public void setItems(List<CheckoutItemDto> items) { this.items = items; }
}
