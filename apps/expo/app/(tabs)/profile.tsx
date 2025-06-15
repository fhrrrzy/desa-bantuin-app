import { View } from 'react-native'
import { Text, YStack, XStack, H4, H6, Image } from '@my/ui'

export default function ProfileTab() {
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
            <H4>John Doe</H4>
            <H6 color="$color10">john.doe@example.com</H6>
          </YStack>
        </YStack>

        {/* Profile Information */}
        <YStack space="$4" style={{ padding: 16, backgroundColor: 'white', borderRadius: 8 }}>
          <H6>Informasi Pengguna</H6>

          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">Nama Lengkap</Text>
            <Text fontWeight="600">John Doe</Text>
          </XStack>

          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">Email</Text>
            <Text fontWeight="600">john.doe@example.com</Text>
          </XStack>

          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">No. Telepon</Text>
            <Text fontWeight="600">+62 812-3456-7890</Text>
          </XStack>

          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color="$color10">Alamat</Text>
            <Text fontWeight="600" style={{ flex: 1 }}>
              Jl. Contoh No. 123, Jakarta
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
      </YStack>
    </View>
  )
}
