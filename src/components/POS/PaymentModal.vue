<template>
  <teleport to="body">
    <div v-show="visible" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl shadow-xl w-[90%] max-w-6xl h-[90%] flex overflow-hidden relative">
        <!-- Left: Payment Methods + Discounts -->
        <div class="flex-1 p-6 overflow-y-auto no-scrollbar space-y-6">
          <PaymentMethods
            ref="paymentMethodRef"
            :selected-method="selectedMethod"
            :amount="amount"
            :method-error="methodError"
            :change-amount="changeAmount"
            @select="selectMethod"
            @update:amount="val => (amount = val)"
            @bakongQr="handleQrPopup"
            @bakongSuccess="handlePaymentSuccess"
          />
          <DiscountSection
            :promoCode="promoCode"
            :discount="discount"
            :manualDiscount="manualDiscount"
            :discountError="discountError"
            @apply="applyDiscount"
            @update:manualDiscount="val => (manualDiscount = val)"
          />
        </div>

        <!-- Right: Cart Summary -->
        <CartSummary
          :cart="cart"
          :total="total"
          :discount="discount"
          :manualDiscount="manualDiscount"
          :discountedTotal="discountedTotal"
          :discountText="discountText"
          @close="close"
          @pay="submitPayment"
        />

        <!-- Receipt Print (only when orderId is set) -->
        <ReceiptPrint
          v-if="orderId"
          :cart="cart"
          :user="user"
          :selectedMethod="selectedMethod"
          :orderId="orderId"
          :total="total"
          :discount="discount"
          :manualDiscount="manualDiscount"
          :discountedTotal="discountedTotal"
        />

        <!-- KHQR Modal for payment confirmation -->
        <div v-if="showQrPopup && qrCode" class="fixed inset-0 z-[60] bg-black bg-opacity-70 flex items-center justify-center">
          <div class="bg-white w-[300px] rounded-[20px] overflow-hidden shadow-xl text-center relative">
            <div class="bg-[#D00000] text-white text-[20px] font-bold py-3 px-4">KHQR</div>
            <div class="px-12 pt-4 pb-2 text-left">
              <p class="font-bold text-[16px] text-[#222]">Eden Coffee</p>
              <p class="text-[25px] font-medium text-black">
                {{ Number(discountedTotal).toLocaleString() }}
                <span class="text-[16px] text-gray-600 ml-1">{{ selectedCurrency }}</span>
              </p>
            </div>
            <div class="border-t border-dashed border-gray-300 mx-6 my-2"></div>
            <div class="pt-4 pb-2 px-4 relative w-fit mx-auto">
              <qrcode-vue :value="qrCode" :size="200" />
              <img :src="currencyLogo" class="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-md" />
            </div>
            <p class="text-[13px] text-gray-600 pt-2 pb-5">Scan KHQR to Pay</p>
            <button @click="cancelQr" class="absolute top-3 right-3 w-7 h-7 text-white font-bold">&times;</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import api from "@/plugins/axios";
import { usePOSStore } from "@/store/pos";
import { useToast } from "vue-toastification";
import QrcodeVue from "qrcode.vue";
import PaymentMethods from "@/components/POS/PaymentMethods.vue";
import DiscountSection from "@/components/POS/DiscountSection.vue";
import CartSummary from "@/components/POS/CartSummary.vue";
import ReceiptPrint from "@/components/POS/ReceiptPrint.vue";

const props = defineProps({ visible: Boolean });
const emit = defineEmits(["close", "success"]);
const { cart, clearCart } = usePOSStore();
const toast = useToast();

// State
const user = ref(null);
const selectedMethod = ref(null);
const amount = ref("");
const promoCode = ref("");
const discount = ref(null);
const manualDiscount = ref(0);
const discountError = ref("");
const methodError = ref("");
const orderId = ref(null);
const selectedCurrency = ref("USD");
const qrCode = ref(null);
const showQrPopup = ref(false);
const polling = ref(null);
const bakongMd5 = ref(null); // store current KHQR MD5

// Computed
const currencyLogo = computed(() =>
  selectedCurrency.value === "KHR" ? "/khr-logo.png" : "/usd-logo.png"
);
const total = computed(() =>
  cart.reduce((sum, item) => sum + item.qty * parseFloat(item.price), 0)
);
const discountedTotal = computed(() => {
  let val = total.value;
  if (discount.value?.type === "percent") val *= 1 - discount.value.value / 100;
  else if (discount.value?.value) val = Math.max(val - discount.value.value, 0);
  if (manualDiscount.value > 0) val *= 1 - manualDiscount.value / 100;
  return parseFloat(val.toFixed(2));
});
const changeAmount = computed(() => {
  if (selectedMethod.value !== "cash") return "0.00";
  const paid = parseFloat(amount.value || 0);
  return paid > discountedTotal.value ? (paid - discountedTotal.value).toFixed(2) : "0.00";
});
const discountText = computed(() =>
  discount.value?.type === "percent"
    ? `${discount.value.value}%`
    : discount.value?.value
    ? `$${discount.value.value}`
    : ""
);

// Lifecycle
onMounted(async () => {
  try {
    const res = await api.get("/me");
    user.value = res.data;
  } catch (e) {
    console.error("Load user failed", e);
  }
});
watch(cart, (val) => val.length === 0 && close());
watch(showQrPopup, (v) => (document.body.style.overflow = v ? "hidden" : ""));

// Methods
const close = () => {
  emit("close");
  orderId.value = null; // Hide receipt after close
};

const selectMethod = (m) => {
  selectedMethod.value = m;
  methodError.value = "";
};

const applyDiscount = async (code) => {
  promoCode.value = code;
  discountError.value = "";
  try {
    const res = await api.get(`/discounts/validate?code=${code}`);
    discount.value = res.data;
  } catch {
    discount.value = null;
    discountError.value = "Invalid or expired code";
  }
};

const cancelQr = () => {
  showQrPopup.value = false;
  if (polling.value) clearInterval(polling.value);
  polling.value = null;
};

const handleQrPopup = (qr) => {
  qrCode.value = qr;
  showQrPopup.value = true;
};

const handlePaymentSuccess = () => {
  showQrPopup.value = false;
  emit("success");
};

const submitPayment = async () => {
  if (!selectedMethod.value) return (methodError.value = "Please select a payment method.");
  const amountToPay = parseFloat(discountedTotal.value);
  if (isNaN(amountToPay) || amountToPay < 0.01) return toast.error("❌ Invalid amount");

  if (selectedMethod.value === "cash") return handleCashPayment();

  if (selectedMethod.value === "khqr") {
    try {
      const qrRes = await api.post("/bakong/generate-qr", {
        amount: amountToPay,
        currency: selectedCurrency.value,
      });
      qrCode.value = qrRes.data.qr_string;
      bakongMd5.value = qrRes.data.md5; // store md5 for polling
      showQrPopup.value = true;
      toast.info("✅ KHQR generated. Waiting...");
      startPollingBakong(qrRes.data.md5);
    } catch (error) {
      console.error("KHQR generation failed:", error);
      toast.error("❌ KHQR generation failed");
    }
  }
};

const handleCashPayment = async () => {
  try {
    const orderRes = await api.post("/orders", {
      items: cart.map((i) => ({ menu_item_id: i.id, quantity: i.qty })),
      code: promoCode.value || null,
    });
    const rawOrderId = orderRes.data.id;
    orderId.value = ((rawOrderId - 1) % 200) + 1;

    await api.post("/payments", {
      order_id: rawOrderId,
      method: "cash",
      amount: discountedTotal.value,
      transaction_id: null,
      note: `Paid via cash${promoCode.value ? ` (Code: ${promoCode.value})` : ""}`,
    });

    await nextTick();
    setTimeout(() => {
      clearCart();
      window.onafterprint = () => {
        location.reload();
        orderId.value = null;
      };
      window.print();
    }, 200);
  } catch (error) {
    console.error("Cash payment failed:", error);
    toast.error("❌ Payment failed");
  }
};

const startPollingBakong = (md5) => {
  if (polling.value) clearInterval(polling.value);
  let attempts = 0;
  polling.value = setInterval(async () => {
    try {
      // API now returns just one transaction object!
      const res = await api.get("/bakong/verify/md5", { params: { md5 } });
      const txn = res.data.result;
      if (
        txn &&
        txn.md5 === md5 &&
        txn.raw_response?.responseCode === 0 &&
        txn.raw_response?.data
      ) {
        clearInterval(polling.value);
        polling.value = null;

        // Place order & payment in your DB
        const orderRes = await api.post("/orders", {
          items: cart.map((i) => ({ menu_item_id: i.id, quantity: i.qty })),
          code: promoCode.value || null,
        });
        const rawOrderId = orderRes.data.id;
        orderId.value = ((rawOrderId - 1) % 200) + 1;

        await api.post("/payments", {
          order_id: rawOrderId,
          method: "khqr",
          amount: discountedTotal.value,
          transaction_id: txn.bill || `TXN-${Date.now()}`,
          note: `Paid via KHQR${promoCode.value ? ` (Code: ${promoCode.value})` : ""}`,
        });

        toast.success("✅ Payment confirmed!");
        showQrPopup.value = false;

        await nextTick();
        setTimeout(() => {
          window.onafterprint = () => {
            location.reload();
            orderId.value = null;
          };
          window.print();
          clearCart();
          emit("success");
        }, 300);
      } else if (++attempts > 300) {
        clearInterval(polling.value);
        polling.value = null;
        toast.error("⏰ Payment timeout");
      }
    } catch (err) {
      console.warn("Polling failed:", err?.response?.data || err.message);
    }
  }, 2000);
};
</script>
