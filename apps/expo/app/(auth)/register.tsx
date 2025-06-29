import React, { useState } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { YStack, XStack, Text, H1, H2, Button, Card, useToastController, Separator } from '@my/ui'
import { Input } from '@tamagui/input'
import { Eye, EyeOff, Phone, Lock, User, Mail, Building2, ArrowLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { useAuth } from '../../src/contexts/AuthContext'

const API_BASE_URL = 'http://10.0.2.2:8000/api'

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
          style={{
            justifyContent: 'center',
            paddingHorizontal: 16,
            backgroundColor: '$background',
          }}
          space="$6"
        >
          {/* Header */}
          <YStack space="$3" style={{ alignItems: 'center' }}>
            <Button
              size="$3"
              circular
              style={{
                backgroundColor: '$color3',
                position: 'absolute',
                top: -20,
                left: 0,
              }}
              onPress={handleBackToLogin}
              icon={ArrowLeft}
              color="$color11"
            />

            <YStack
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: '$blue10',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Building2 size={40} color="white" />
            </YStack>

            <H1 fontSize="$8" fontWeight="bold" color="$color12" style={{ textAlign: 'center' }}>
              Desa Bantuin
            </H1>

            <Text fontSize="$4" color="$color11" style={{ textAlign: 'center', lineHeight: 24 }}>
              Daftar akun baru untuk mengakses layanan desa
            </Text>
          </YStack>

          {/* Register Form */}
          <Card
            style={{
              backgroundColor: '$color2',
              borderColor: '$color6',
              borderWidth: 1,
              borderRadius: 16,
              padding: 16,
            }}
            space="$4"
          >
            <H2 fontSize="$5" fontWeight="600" color="$color12" style={{ textAlign: 'center' }}>
              Daftar
            </H2>

            <YStack space="$4">
              {/* Name */}
              <YStack space="$2">
                <Text fontSize="$3" fontWeight="500" color="$color11">
                  Nama Lengkap
                </Text>
                <XStack
                  style={{
                    borderWidth: 1,
                    borderColor: '$color7',
                    borderRadius: 12,
                    backgroundColor: '$color1',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                  }}
                >
                  <User size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChangeText={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.nativeEvent.text }))
                    }
                    borderWidth={0}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                    }}
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
                  style={{
                    borderWidth: 1,
                    borderColor: '$color7',
                    borderRadius: 12,
                    backgroundColor: '$color1',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                  }}
                >
                  <Mail size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChangeText={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.nativeEvent.text }))
                    }
                    borderWidth={0}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                    }}
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
                  style={{
                    borderWidth: 1,
                    borderColor: '$color7',
                    borderRadius: 12,
                    backgroundColor: '$color1',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                  }}
                >
                  <Phone size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="081234567890"
                    value={formData.phone_number}
                    onChangeText={(e) =>
                      setFormData((prev) => ({ ...prev, phone_number: e.nativeEvent.text }))
                    }
                    borderWidth={0}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                    }}
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
                  style={{
                    borderWidth: 1,
                    borderColor: '$color7',
                    borderRadius: 12,
                    backgroundColor: '$color1',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                  }}
                >
                  <Lock size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChangeText={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.nativeEvent.text }))
                    }
                    borderWidth={0}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                    }}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <Button
                    size="$2"
                    circular
                    style={{ backgroundColor: 'transparent' }}
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
                  style={{
                    borderWidth: 1,
                    borderColor: '$color7',
                    borderRadius: 12,
                    backgroundColor: '$color1',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                  }}
                >
                  <Lock size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="Ulangi password"
                    value={formData.password_confirmation}
                    onChangeText={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password_confirmation: e.nativeEvent.text,
                      }))
                    }
                    borderWidth={0}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <Button
                    size="$2"
                    circular
                    style={{ backgroundColor: 'transparent' }}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    icon={showConfirmPassword ? EyeOff : Eye}
                    color="$color10"
                  />
                </XStack>
              </YStack>

              {/* Register Button */}
              <Button
                size="$4"
                style={{
                  backgroundColor: '$blue10',
                  marginTop: 8,
                }}
                color="white"
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Daftar'}
              </Button>
            </YStack>
          </Card>

          {/* Login Link */}
          <YStack space="$3" style={{ alignItems: 'center' }}>
            <Separator />
            <XStack space="$2" style={{ alignItems: 'center' }}>
              <Text fontSize="$3" color="$color11">
                Sudah punya akun?
              </Text>
              <Button
                size="$3"
                style={{ backgroundColor: 'transparent' }}
                color="$blue10"
                onPress={handleBackToLogin}
                fontWeight="600"
              >
                Masuk
              </Button>
            </XStack>
          </YStack>

          {/* Footer */}
          <YStack space="$2" style={{ alignItems: 'center', marginTop: 16 }}>
            <Text fontSize="$2" color="$color10" style={{ textAlign: 'center' }}>
              Aplikasi Layanan Desa Digital
            </Text>
            <Text fontSize="$2" color="$color10" style={{ textAlign: 'center' }}>
              © 2024 Desa Bantuin. All rights reserved.
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
