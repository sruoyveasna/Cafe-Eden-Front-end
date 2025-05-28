<template>
  <AppLayout>
    <div class="p-6 max-w-6xl mx-auto space-y-6">
      <!-- Header: Language Switcher + Page Title -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">{{ $t('profile.title') }}</h2>
        <div class="flex gap-3 items-center">
          <button
            @click="changeLanguage('en')"
            :class="[
              'flex items-center gap-2 px-4 py-1.5 rounded-full shadow-inner transition-all border',
              locale === 'en'
                ? 'bg-white text-gray-800 border-gray-300'
                : 'bg-gray-100 text-gray-500 hover:text-gray-800 border-gray-200'
            ]"
          >
            <img src="/flags/en.png" class="w-5 h-5 rounded-full shadow" />
            <span class="font-semibold text-sm">EN</span>
          </button>
          <button
            @click="changeLanguage('km')"
            :class="[
              'flex items-center gap-2 px-4 py-1.5 rounded-full shadow-inner transition-all border',
              locale === 'km'
                ? 'bg-white text-gray-800 border-gray-300'
                : 'bg-gray-100 text-gray-500 hover:text-gray-800 border-gray-200'
            ]"
          >
            <img src="/flags/kh.png" class="w-5 h-5 rounded-full shadow" />
            <span class="font-semibold text-sm">ខ្មែរ</span>
          </button>
        </div>
      </div>

      <!-- Main Profile Layout -->
      <div class="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Left: Profile Summary -->
        <div class="flex flex-col items-center justify-center text-center space-y-4 border-r md:pr-6">
          <img
            :src="preview || profile.avatar_url || defaultAvatar"
            class="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
          />
          <div class="space-y-1">
            <p class="text-xl font-semibold text-gray-800">{{ profile.name || 'Loading...' }}</p>
            <p class="text-sm text-gray-500">{{ profile.email || 'user@example.com' }}</p>
            <p class="text-sm text-gray-500">
              <span class="text-xs font-medium text-white bg-purple-600 px-3 py-1 rounded-full capitalize">
                {{ profile.role || 'User' }}
              </span>
            </p>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
          <button @click="$refs.fileInput.click()" class="btn-secondary text-sm">
            📷 {{ $t('profile.change_avatar') }}
          </button>
          <button @click="showEditModal = true" class="btn-primary text-sm">
            ✏️ {{ $t('profile.edit_profile') }}
          </button>
        </div>

        <!-- Right: Read-Only Profile Info -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ $t('profile.name') }}</label>
              <input v-model="form.name" type="text" class="input" disabled />
            </div>
            <div>
              <label class="label">{{ $t('profile.phone') }}</label>
              <input v-model="form.phone" type="text" class="input" disabled />
            </div>
            <div>
              <label class="label">{{ $t('profile.gender') }}</label>
              <input v-model="form.gender" type="text" class="input" disabled />
            </div>
            <div>
              <label class="label">{{ $t('profile.birthdate') }}</label>
              <input v-model="form.birthdate" type="date" class="input" disabled />
            </div>
            <div class="col-span-2">
              <label class="label">{{ $t('profile.address') }}</label>
              <textarea v-model="form.address" rows="3" class="input resize-none w-full" disabled></textarea>
            </div>
            <div class="col-span-2">
              <label class="label">{{ $t('profile.email') }}</label>
              <input v-model="form.email" type="email" class="input" disabled />
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl space-y-4 relative">
          <h2 class="text-xl font-semibold text-purple-700">{{ $t('profile.edit_profile') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">{{ $t('profile.name') }}</label>
              <input v-model="form.name" type="text" class="input" />
            </div>
            <div>
              <label class="label">{{ $t('profile.phone') }}</label>
              <input v-model="form.phone" type="text" class="input" />
            </div>
            <div>
              <label class="label">{{ $t('profile.gender') }}</label>
              <select v-model="form.gender" class="input">
                <option value="">{{ $t('profile.select') }}</option>
                <option value="male">{{ $t('profile.male') }}</option>
                <option value="female">{{ $t('profile.female') }}</option>
                <option value="other">{{ $t('profile.other') }}</option>
              </select>
            </div>
            <div>
              <label class="label">{{ $t('profile.birthdate') }}</label>
              <input v-model="form.birthdate" type="date" class="input" />
            </div>
            <div class="col-span-2">
              <label class="label">{{ $t('profile.address') }}</label>
              <textarea v-model="form.address" rows="3" class="input resize-none w-full"></textarea>
            </div>
            <div class="col-span-2">
              <label class="label">{{ $t('profile.email') }}</label>
              <input v-model="form.email" type="email" class="input" />
            </div>
          </div>
          <div class="flex justify-between items-center pt-4 border-t">
            <button @click="showPasswordModal = true" class="text-sm text-red-600 hover:underline">
              🔒 {{ $t('profile.change_password') }}
            </button>
            <div class="flex gap-3">
              <button @click="cancelEdit(); showEditModal = false" class="btn-secondary">
                {{ $t('common.cancel') }}
              </button>
              <button @click="submitForm(); showEditModal = false" class="btn-primary">
                {{ $t('common.save') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Change Password Modal -->
      <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 relative">
          <h2 class="text-xl font-semibold text-purple-700">{{ $t('profile.change_password') }}</h2>
          <input
            v-model="passwordForm.current"
            type="password"
            :placeholder="$t('profile.current_password')"
            class="input"
          />
          <input
            v-model="passwordForm.new"
            type="password"
            :placeholder="$t('profile.new_password')"
            class="input"
          />
          <input
            v-model="passwordForm.confirm"
            type="password"
            :placeholder="$t('profile.confirm_password')"
            class="input"
          />
          <div class="flex justify-end gap-2 pt-2">
            <button class="btn-secondary" @click="showPasswordModal = false">{{ $t('common.cancel') }}</button>
            <button class="btn-primary" @click="updatePassword">{{ $t('common.update') }}</button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/Common/AppLayout.vue'
import { useToast } from 'vue-toastification'

const { locale } = useI18n()
const toast = useToast()

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

const profile = ref({})
const form = ref({})
const preview = ref(null)
const defaultAvatar = '/images/default-avatar.png'

const showPasswordModal = ref(false)
const showEditModal = ref(false)
const passwordForm = ref({ current: '', new: '', confirm: '' })

const fetchProfile = async () => {
  try {
    const userRes = await api.get('/me')
    const profileRes = await api.get('/profile')

    profile.value = {
      name: userRes.data.name,
      email: userRes.data.email,
      role: userRes.data.role?.name || 'User',
      ...profileRes.data.profile,
      avatar_url: profileRes.data.profile?.avatar_url,
    }

    form.value = { ...profile.value }
  } catch (err) {
    toast.error('Failed to load profile')
  }
}

const submitForm = async () => {
  try {
    await api.put('/me', {
      name: form.value.name,
      email: form.value.email,
    })

    await api.put('/profile', {
      phone: form.value.phone,
      gender: form.value.gender,
      birthdate: form.value.birthdate,
      address: form.value.address,
    })

    toast.success('Profile updated successfully')
    fetchProfile()
  } catch (err) {
    toast.error('Failed to update profile')
  }
}

const cancelEdit = () => {
  form.value = { ...profile.value }
}

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => (preview.value = e.target.result)
  reader.readAsDataURL(file)

  const fd = new FormData()
  fd.append('avatar', file)
  try {
    const res = await api.post('/profile/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    toast.success('Avatar updated')
    profile.value.avatar_url = res.data.avatar_url
    preview.value = null
  } catch (err) {
    toast.error('Failed to upload avatar')
  }
}

const updatePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    return toast.error("Passwords don't match")
  }
  try {
    await api.post('/profile/password', {
      current_password: passwordForm.value.current,
      new_password: passwordForm.value.new,
      new_password_confirmation: passwordForm.value.confirm,
    })
    toast.success('Password updated')
    showPasswordModal.value = false
    passwordForm.value = { current: '', new: '', confirm: '' }
  } catch (err) {
    toast.error('Failed to update password')
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.label {
  @apply text-sm font-semibold text-gray-700 mb-1 block;
}
.input {
  @apply border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400;
}
.btn-primary {
  @apply bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition;
}
</style>
