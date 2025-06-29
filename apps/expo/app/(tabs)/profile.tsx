import { View } from 'react-native'
import { Text, YStack, XStack, H4, H6, Image, Button } from '@my/ui'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'solito/navigation'
import { LogOut } from '@tamagui/lucide-icons'

export default function ProfileTab() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <YStack style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </YStack>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <YStack style={{ flex: 1, padding: 16 }} space="$4">
        {/* Header with Avatar */}
        <YStack style={{ alignItems: 'center', paddingVertical: 24 }} space="$4">
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              overflow: 'hidden',
              backgroundColor: '#e3f2fd',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={{ uri: 'https://i.pravatar.cc/300' }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
              }}
            />
          </View>

          <YStack style={{ alignItems: 'center' }} space="$2">
            <H4>{user.name}</H4>
            <H6 color="$color10">{user.email}</H6>
          </YStack>
        </YStack>

        {/* Profile Information */}
        <YStack space="$4" style={{ padding: 16, backgroundColor: 'white', borderRadius: 8 }}>
          <H6>Informasi Pengguna</H6>

          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">Nama Lengkap</Text>
            <Text fontWeight="600">{user.name}</Text>
          </XStack>

          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">Email</Text>
            <Text fontWeight="600">{user.email}</Text>
          </XStack>

          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">No. Telepon</Text>
            <Text fontWeight="600">{user.phone_number}</Text>
          </XStack>

          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">Role</Text>
            <Text fontWeight="600" style={{ textTransform: 'capitalize' }}>
              {user.role}
            </Text>
          </XStack>
        </YStack>

        {/* Additional Info */}
        <YStack space="$4" style={{ padding: 16, backgroundColor: 'white', borderRadius: 8 }}>
          <H6>Status</H6>
          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">Status Akun</Text>
            <Text color="$green10" fontWeight="600">
              Aktif
            </Text>
          </XStack>

          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">Bergabung Sejak</Text>
            <Text fontWeight="600">Januari 2024</Text>
          </XStack>
        </YStack>

        {/* Logout Button */}
        <Button
          size="$4"
          backgroundColor="$red10"
          color="white"
          onPress={handleLogout}
          icon={LogOut}
        >
          Keluar
        </Button>
      </YStack>
    </View>
  )
}
