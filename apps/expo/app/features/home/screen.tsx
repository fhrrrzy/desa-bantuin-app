import React, { useState, useEffect } from 'react'
import { ScrollView, RefreshControl } from 'react-native'
import { YStack, XStack, Text, H1, H2, Button, Card, Separator, useToastController } from '@my/ui'
import {
  User,
  FileText,
  Plus,
  LogOut,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
} from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'

const API_BASE_URL = 'http://localhost:8000/api'

interface RequestStatistics {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface RecentRequest {
  id: number
  laporan_type: string
  type: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export function HomeScreen() {
  const router = useRouter()
  const toast = useToastController()

  const [statistics, setStatistics] = useState<RequestStatistics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Dummy data for recent requests
  const dummyRecentRequests: RecentRequest[] = [
    {
      id: 1,
      laporan_type: 'KTP',
      type: 'permintaan',
      description: 'Permintaan pembuatan KTP baru',
      status: 'pending',
      created_at: '2024-01-15 10:30:00',
    },
    {
      id: 2,
      laporan_type: 'KK',
      type: 'permintaan',
      description: 'Permintaan pembuatan Kartu Keluarga',
      status: 'approved',
      created_at: '2024-01-14 14:20:00',
    },
    {
      id: 3,
      laporan_type: 'Surat Keterangan',
      type: 'permintaan',
      description: 'Surat keterangan domisili',
      status: 'rejected',
      created_at: '2024-01-13 09:15:00',
    },
    {
      id: 4,
      laporan_type: 'Izin Usaha',
      type: 'permintaan',
      description: 'Permintaan izin usaha toko kelontong',
      status: 'pending',
      created_at: '2024-01-12 16:45:00',
    },
    {
      id: 5,
      laporan_type: 'Akta Kelahiran',
      type: 'permintaan',
      description: 'Pembuatan akta kelahiran anak',
      status: 'approved',
      created_at: '2024-01-11 11:30:00',
    },
  ]

  useEffect(() => {
    fetchStatistics()
    setRecentRequests(dummyRecentRequests)
  }, [])

  const fetchStatistics = async () => {
    setIsLoading(true)
    try {
      // Simulate API call with dummy data
      const dummyStats: RequestStatistics = {
        total: 15,
        pending: 3,
        approved: 10,
        rejected: 2,
      }
      setStatistics(dummyStats)
    } catch (error) {
      console.error('Error fetching statistics:', error)
      toast.show('Error', {
        message: 'Gagal memuat data statistik',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchStatistics()
    setRefreshing(false)
  }

  const handleLogout = async () => {
    try {
      toast.show('Berhasil', {
        message: 'Berhasil keluar',
      })
      router.replace('/')
    } catch (error) {
      toast.show('Error', {
        message: 'Gagal keluar',
      })
    }
  }

  const handleCreateRequest = () => {
    router.push('/create-request')
  }

  const handleViewRequests = () => {
    router.push('/requests')
  }

  const handleViewProfile = () => {
    router.push('/profile')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'green'
      case 'rejected':
        return 'red'
      case 'pending':
        return 'yellow'
      default:
        return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} color="green" />
      case 'rejected':
        return <XCircle size={16} color="red" />
      case 'pending':
        return <Clock size={16} color="orange" />
      default:
        return <Clock size={16} color="gray" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <YStack style={{ flex: 1, padding: 16 }} space="$6">
        {/* Header */}
        <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <YStack>
            <H1 color="$color12">Selamat Datang</H1>
            <Text color="$color10" fontSize="$4">
              User
            </Text>
          </YStack>
          <XStack space="$2">
            <Button size="$2" circular icon={Settings} onPress={handleViewProfile} chromeless />
            <Button size="$2" circular icon={LogOut} onPress={handleLogout} chromeless />
          </XStack>
        </XStack>

        {/* Statistics Cards */}
        <YStack space="$3">
          <H2 fontSize="$6" color="$color12">
            Statistik Permintaan
          </H2>
          <XStack space="$3" style={{ flexWrap: 'wrap' }}>
            <Card style={{ flex: 1, padding: 12 }} backgroundColor="$color2">
              <XStack style={{ alignItems: 'center' }} space="$2">
                <BarChart3 size={20} color="$color10" />
                <YStack>
                  <Text fontSize="$2" color="$color10">
                    Total
                  </Text>
                  <Text fontSize="$4" fontWeight="bold" color="$color12">
                    {statistics.total}
                  </Text>
                </YStack>
              </XStack>
            </Card>
            <Card style={{ flex: 1, padding: 12 }} backgroundColor="$color2">
              <XStack style={{ alignItems: 'center' }} space="$2">
                <Clock size={20} color="$color10" />
                <YStack>
                  <Text fontSize="$2" color="$color10">
                    Pending
                  </Text>
                  <Text fontSize="$4" fontWeight="bold" color="$color12">
                    {statistics.pending}
                  </Text>
                </YStack>
              </XStack>
            </Card>
            <Card style={{ flex: 1, padding: 12 }} backgroundColor="$color2">
              <XStack style={{ alignItems: 'center' }} space="$2">
                <CheckCircle size={20} color="$color10" />
                <YStack>
                  <Text fontSize="$2" color="$color10">
                    Disetujui
                  </Text>
                  <Text fontSize="$4" fontWeight="bold" color="$color12">
                    {statistics.approved}
                  </Text>
                </YStack>
              </XStack>
            </Card>
            <Card style={{ flex: 1, padding: 12 }} backgroundColor="$color2">
              <XStack style={{ alignItems: 'center' }} space="$2">
                <XCircle size={20} color="$color10" />
                <YStack>
                  <Text fontSize="$2" color="$color10">
                    Ditolak
                  </Text>
                  <Text fontSize="$4" fontWeight="bold" color="$color12">
                    {statistics.rejected}
                  </Text>
                </YStack>
              </XStack>
            </Card>
          </XStack>
        </YStack>

        {/* Action Buttons */}
        <YStack space="$3">
          <H2 fontSize="$6" color="$color12">
            Aksi Cepat
          </H2>
          <XStack space="$3">
            <Button flex={1} size="$4" theme="blue" icon={Plus} onPress={handleCreateRequest}>
              Buat Permintaan
            </Button>
            <Button flex={1} size="$4" theme="blue" icon={FileText} onPress={handleViewRequests}>
              Lihat Semua
            </Button>
          </XStack>
        </YStack>

        {/* Recent Requests Cards */}
        <YStack space="$3">
          <H2 fontSize="$6" color="$color12">
            Permintaan Terbaru
          </H2>
          <YStack space="$2">
            {recentRequests.map((request) => (
              <Card key={request.id} style={{ padding: 12 }} backgroundColor="$color2">
                <YStack space="$2">
                  <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text fontSize="$4" fontWeight="bold" color="$color12">
                      {request.laporan_type}
                    </Text>
                    <XStack style={{ alignItems: 'center' }} space="$1">
                      {getStatusIcon(request.status)}
                      <Text
                        fontSize="$2"
                        fontWeight="bold"
                        color={
                          request.status === 'approved'
                            ? 'green'
                            : request.status === 'rejected'
                              ? 'red'
                              : 'orange'
                        }
                      >
                        {request.status === 'pending' && 'Pending'}
                        {request.status === 'approved' && 'Disetujui'}
                        {request.status === 'rejected' && 'Ditolak'}
                      </Text>
                    </XStack>
                  </XStack>
                  <Text fontSize="$3" color="$color11" numberOfLines={2}>
                    {request.description}
                  </Text>
                  <Text fontSize="$2" color="$color10">
                    {formatDate(request.created_at)}
                  </Text>
                </YStack>
              </Card>
            ))}
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
