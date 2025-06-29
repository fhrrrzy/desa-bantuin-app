import React, { useState } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { YStack, XStack, Text, H1, H2, Button, Card, useToastController, Separator } from '@my/ui'
import { Input } from '@tamagui/input'
import { Eye, EyeOff, Phone, Lock, Building2 } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { useAuth } from '../../src/contexts/AuthContext'

const API_BASE_URL = 'http://10.0.2.2:8000/api'

interface LoginFormData {
  phone_number: string
  password: string
}

interface LoginResponse {
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

export default function LoginScreen() {
  const router = useRouter()
  const toast = useToastController()
  const { login } = useAuth()

  const [formData, setFormData] = useState<LoginFormData>({
    phone_number: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!formData.phone_number || !formData.password) {
      toast.show('Error', {
        message: 'Mohon lengkapi nomor telepon dan password',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: LoginResponse = await response.json()

      if (response.ok && data.success) {
        // Use auth context to login
        await login(data.data.token, data.data.user)

        toast.show('Berhasil', {
          message: data.message || 'Login berhasil',
        })

        // Navigate to home screen
        router.replace('/(tabs)/home')
      } else {
        toast.show('Error', {
          message: data.message || 'Login gagal',
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.show('Error', {
        message: 'Terjadi kesalahan saat login',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = () => {
    router.push('/register')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <YStack
          flex={1}
          space="$6"
          style={{
            justifyContent: 'center',
            paddingHorizontal: 16,
            backgroundColor: '$background',
          }}
        >
          {/* Header */}
          <YStack space="$3" style={{ alignItems: 'center' }}>
            <YStack
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: '#3b82f6',
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
              Masuk ke akun Anda untuk mengakses layanan desa
            </Text>
          </YStack>

          {/* Login Form */}
          <Card
            borderColor="$color6"
            borderWidth={1}
            padding="$4"
            space="$4"
            style={{ borderRadius: 16, backgroundColor: '$color2' }}
          >
            <H2 fontSize="$5" fontWeight="600" color="$color12" style={{ textAlign: 'center' }}>
              Masuk
            </H2>

            <YStack space="$4">
              {/* Phone Number */}
              <YStack space="$2">
                <Text fontSize="$3" fontWeight="500" color="$color11">
                  Nomor Telepon
                </Text>
                <XStack
                  borderWidth={1}
                  borderColor="$color7"
                  style={{
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: '$color1',
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
                    paddingVertical="$3"
                    paddingHorizontal="$2"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    style={{ backgroundColor: 'transparent' }}
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
                  style={{
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: '$color1',
                    paddingHorizontal: 12,
                  }}
                >
                  <Lock size={20} color="$color10" />
                  <Input
                    flex={1}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChangeText={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.nativeEvent.text }))
                    }
                    borderWidth={0}
                    paddingVertical="$3"
                    paddingHorizontal="$2"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    style={{ backgroundColor: 'transparent' }}
                  />
                  <Button
                    size="$2"
                    circular
                    onPress={() => setShowPassword(!showPassword)}
                    icon={showPassword ? EyeOff : Eye}
                    color="$color10"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </XStack>
              </YStack>

              {/* Login Button */}
              <Button
                size="$4"
                color="white"
                onPress={handleLogin}
                disabled={isLoading}
                style={{ marginTop: 8, backgroundColor: '$blue10' }}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </YStack>
          </Card>

          {/* Register Link */}
          <YStack space="$3" style={{ alignItems: 'center' }}>
            <Separator />
            <XStack space="$2" style={{ alignItems: 'center' }}>
              <Text fontSize="$3" color="$color11">
                Belum punya akun?
              </Text>
              <Button
                size="$3"
                color="$blue10"
                onPress={handleRegister}
                fontWeight="600"
                style={{ backgroundColor: 'transparent' }}
              >
                Daftar
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
