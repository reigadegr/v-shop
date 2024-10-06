<script setup lang="ts">
import { showToast } from "vant";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, unref } from "vue";
import { getClientInfo } from "@/utils";
import { loginProviderType } from "@/constants/modules/user";
// store
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loginType = ref("system");
const loginProvider = computed(() => {
  return loginProviderType[unref(loginType)] || {};
});
computed(() => {
  return unref(loginType) === "sms" ? "密码登录" : "验证码1登录";
});
const mobile = ref("");
const pwd = ref("");
const smsCode = ref("");
ref(true);
const submitLoading = ref(false);
const submitted = computed(() => {
  if (unref(loginType) === "sms") {
    return unref(mobile) && unref(smsCode);
  }

  return unref(mobile) && unref(pwd);
});

function onSubmit() {
  // if (!isMobile(unref(mobile))) {
  //   showToast("手机号格式错误");
  //   return;
  // }

  const params: Recordable = {
    mobile: unref(mobile),
    deviceId: getClientInfo().deviceId,
    deviceName: getClientInfo().deviceType,
  };

  if (unref(loginType) === "system") {
    params.pwd = unref(pwd);
  }

  if (unref(loginType) === "sms") {
    params.autoReg = true;
    params.code = unref(smsCode);
  }

  submitLoading.value = true;

  userStore
      .login({ provider: unref(loginType), params })
      .then(() => {
        submitLoading.value = false;
        route.query.redirect
            ? router.replace({ path: route.query.redirect as string })
            : router.replace({ path: "/" });
        showToast({
          type: "success",
          message: "登录成功",
        });
      })
      .catch((err) => {
        console.error(err);
        submitLoading.value = false;
      });
}
</script>

<template>
  <div class="container">
    <div class="main">
      <div class="h2">{{ loginProvider.h2 }}</div>
      <form class="form">
        <div class="form-item">
          <van-field
              v-model="mobile"
              class="form-field"
              :border="false"
              type="tel"
              placeholder="请输入用户名"
              autocomplete="username"
              clearable
          />
          <input type="text" hidden autocomplete="username" />
        </div>
        <div v-if="loginType === 'system'" class="form-item">
          <PwdField
              v-model="pwd"
              class="form-field"
              :border="false"
              placeholder="请输入密码"
              autocomplete="current-password"
              clearable
          />
        </div>
        <van-button
            class="form-submit"
            block
            :disabled="!submitted"
            :loading="submitLoading"
            loading-text="登录中..."
            type="primary"
            @click="onSubmit"
        >登录
        </van-button>
      </form>
    </div>
    <div class="footer">
      <div class="footer-agreement">
        <span>bs_desktop.Inc</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "@/styles/mixins/login.less";

.login();
</style>
