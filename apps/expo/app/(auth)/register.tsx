import React, { useState } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { YStack, XStack, Text, H1, H2, Button, Card, useToastController, Separator } from '@my/ui'
import { Input } from '@tamagui/input'
import { Eye, EyeOff, Phone, Lock, User, Mail, Building2, ArrowLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { useAuth } from '../contexts/AuthContext'

const API_BASE_URL = 'http://localhost:8000/api'

interface RegisterFormData {
  name: string
  email: string
  phone_number: string
  password: string
  password_confirmation: string
}

interface RegisterResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: number
      name: string
      email: string
      phone_number: string
      role: string
    }
    token: string
    token_type: string
  }
}

export default function RegisterScreen() {
  const router = useRouter()
  const toast = useToastController()
  const { login } = useAuth()

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleRegister = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.password ||
      !formData.password_confirmation
    ) {
      toast.show('Error', {
        message: 'Mohon lengkapi semua field yang diperlukan',
      })
      return
    }

    if (formData.password !== formData.password_confirmation) {
      toast.show('Error', {
        message: 'Password dan konfirmasi password tidak cocok',
      })
      return
    }

    if (formData.password.length < 6) {
      toast.show('Error', {
        message: 'Password minimal 6 karakter',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: RegisterResponse = await response.json()

      if (response.ok && data.success) {
        // Use auth context to login
        await login(data.data.token, data.data.user)

        toast.show('Berhasil', {
          message: data.message || 'Registrasi berhasil!',
        })

        // Navigate to home
        router.replace('/(tabs)/home')
      } else {
        toast.show('Error', {
          message: data.message || 'Registrasi gagal',
        })
      }
    } catch (error) {
      console.error('Register error:', error)
      toast.show('Error', {
        message: 'Terjadi kesalahan saat registrasi',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    router.replace('/login')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <YStack
          flex={1}
          justifyContent="center"
          paddingHorizontal="$4"
          space="$6"
          backgroundColor="$background"
        >
          {/* Header */}
          <YStack space="$3" alignItems="center">
            <Button
              size="$3"
              circular
              backgroundColor="$color3"
              position="absolute"
              top={-20}
              left={0}
              onPress={handleBackToLogin}
              icon={ArrowLeft}
              color="$color11"
            />

            <YStack
              width={80}
              height={80}
              borderRadius="$6"
              backgroundColor="$blue10"
              justifyContent="center"
              alignItems="center"
              marginBottom="$2"
            >
              <Building2 size={40} color="white" />
            </YStack>

            <H1 fontSize="$8" fontWeight="bold" textAlign="center" color="$color12">
              Desa Bantuin
            </H1>

            <Text fontSize="$4" textAlign="center" color="$color11" lineHeight={24}>
              Daftar akun baru untuk mengakses layanan desa
            </Text>
          </YStack>

          {/* Register Form */}
          <Card
            backgroundColor="$color2"
            borderColor="$color6"
            borderWidth={1}
            borderRadius="$4"
            padding="$4"
            space="$4"
          >
            <H2 fontSize="$5" fontWeight="600" textAlign="center" color="$color12">
              Daftar
            </H2>

            <YStack space="$4">
              {/* Name */}
              <YStack space="$2">
                <Text fontSize="$3" fontWeight="500" color="$color11">
                  Nama Lengkap
                </Text>
                <XStack
                  borderWidth={1}
                  borderColor="$color7"
                  borderRadius="$3"
                  backgroundColor="$color1"
                  alignItems="center"
                  paddingHorizontal="$3"
                  focusStyle={{ borderColor: '$blue10' }}
                >
                  <User size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                    borderWidth={0}
                    backgroundColor="transparent"
                    fontSize="$4"
                    paddingVertical="$3"
                    paddingHorizontal="$2"
                    autoComplete="name"
                  />
                </XStack>
              </YStack>

              {/* Email */}
              <YStack space="$2">
                <Text fontSize="$3" fontWeight="500" color="$color11">
                  Email
                </Text>
                <XStack
                  borderWidth={1}
                  borderColor="$color7"
                  borderRadius="$3"
                  backgroundColor="$color1"
                  alignItems="center"
                  paddingHorizontal="$3"
                  focusStyle={{ borderColor: '$blue10' }}
                >
                  <Mail size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
                    borderWidth={0}
                    backgroundColor="transparent"
                    fontSize="$4"
                    paddingVertical="$3"
                    paddingHorizontal="$2"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                  />
                </XStack>
              </YStack>

              {/* Phone Number */}
              <YStack space="$2">
                <Text fontSize="$3" fontWeight="500" color="$color11">
                  Nomor Telepon
                </Text>
                <XStack
                  borderWidth={1}
                  borderColor="$color7"
                  borderRadius="$3"
                  backgroundColor="$color1"
                  alignItems="center"
                  paddingHorizontal="$3"
                  focusStyle={{ borderColor: '$blue10' }}
                >
                  <Phone size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="081234567890"
                    value={formData.phone_number}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, phone_number: text }))
                    }
                    borderWidth={0}
                    backgroundColor="transparent"
                    fontSize="$4"
                    paddingVertical="$3"
                    paddingHorizontal="$2"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                  />
                </XStack>
              </YStack>

              {/* Password */}
              <YStack space="$2">
                <Text fontSize="$3" fontWeight="500" color="$color11">
                  Password
                </Text>
                <XStack
                  borderWidth={1}
                  borderColor="$color7"
                  borderRadius="$3"
                  backgroundColor="$color1"
                  alignItems="center"
                  paddingHorizontal="$3"
                  focusStyle={{ borderColor: '$blue10' }}
                >
                  <Lock size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                    borderWidth={0}
                    backgroundColor="transparent"
                    fontSize="$4"
                    paddingVertical="$3"
                    paddingHorizontal="$2"
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <Button
                    size="$2"
                    circular
                    backgroundColor="transparent"
                    onPress={() => setShowPassword(!showPassword)}
                    icon={showPassword ? EyeOff : Eye}
                    color="$color10"
                  />
                </XStack>
              </YStack>

              {/* Confirm Password */}
              <YStack space="$2">
                <Text fontSize="$3" fontWeight="500" color="$color11">
                  Konfirmasi Password
                </Text>
                <XStack
                  borderWidth={1}
                  borderColor="$color7"
                  borderRadius="$3"
                  backgroundColor="$color1"
                  alignItems="center"
                  paddingHorizontal="$3"
                  focusStyle={{ borderColor: '$blue10' }}
                >
                  <Lock size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="Ulangi password"
                    value={formData.password_confirmation}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, password_confirmation: text }))
                    }
                    borderWidth={0}
                    backgroundColor="transparent"
                    fontSize="$4"
                    paddingVertical="$3"
                    paddingHorizontal="$2"
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <Button
                    size="$2"
                    circular
                    backgroundColor="transparent"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    icon={showConfirmPassword ? EyeOff : Eye}
                    color="$color10"
                  />
                </XStack>
              </YStack>

              {/* Register Button */}
              <Button
                size="$4"
                backgroundColor="$blue10"
                color="white"
                onPress={handleRegister}
                disabled={isLoading}
                marginTop="$2"
              >
                {isLoading ? 'Memproses...' : 'Daftar'}
              </Button>
            </YStack>
          </Card>

          {/* Login Link */}
          <YStack space="$3" alignItems="center">
            <Separator />
            <XStack space="$2" alignItems="center">
              <Text fontSize="$3" color="$color11">
                Sudah punya akun?
              </Text>
              <Button
                size="$3"
                backgroundColor="transparent"
                color="$blue10"
                onPress={handleBackToLogin}
                fontWeight="600"
              >
                Masuk
              </Button>
            </XStack>
          </YStack>

          {/* Footer */}
          <YStack space="$2" alignItems="center" marginTop="$4">
            <Text fontSize="$2" color="$color10" textAlign="center">
              Aplikasi Layanan Desa Digital
            </Text>
            <Text fontSize="$2" color="$color10" textAlign="center">
              © 2024 Desa Bantuin. All rights reserved.
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
