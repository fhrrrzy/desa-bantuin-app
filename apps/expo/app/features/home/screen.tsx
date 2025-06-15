import React, { useState, useEffect } from 'react'
import { ScrollView, RefreshControl, Image } from 'react-native'
import {
  YStack,
  XStack,
  Text,
  H1,
  H2,
  Button,
  Card,
  Separator,
  useToastController,
  Sheet,
} from '@my/ui'
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
  X,
  Hash,
  CalendarDays,
  Paperclip,
  Image as ImageIcon,
} from '@tamagui/lucide-icons'
import { useRouter } from 'solito/navigation'
import { CreateRequestSheet, FormData } from '../../components/CreateRequestSheet'

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
  const [selectedRequest, setSelectedRequest] = useState<RecentRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [formSheetOpen, setFormSheetOpen] = useState(false)

  const documentTypes = [
    'KTP',
    'KK',
    'Buku Nikah',
    'Akta Nikah',
    'Akta Lahir',
    'Surat Kematian',
    'KIA (Kartu identitas anak)',
    'KIS (Kartu Indonesia Sehat)',
  ]

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

  // Dummy attachment images
  const dummyAttachments = [
    {
      url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      filename: 'ktp_scan.jpg',
    },
    {
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      filename: 'kk_dokumen.pdf',
    },
    {
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
      filename: 'surat_pengantar.png',
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
    setFormSheetOpen(true)
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

  const handleRequestPress = (request: RecentRequest) => {
    setSelectedRequest(request)
    setSheetOpen(true)
  }

  const closeSheet = () => {
    setSheetOpen(false)
    setSelectedRequest(null)
  }

  const getStatusBadge = (status: string) => {
    const baseStyle = {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: '600' as const,
    }

    switch (status) {
      case 'pending':
        return (
          <Text
            style={{
              ...baseStyle,
              backgroundColor: '#fef3c7',
              color: '#d97706',
            }}
          >
            Pending
          </Text>
        )
      case 'approved':
        return (
          <Text
            style={{
              ...baseStyle,
              backgroundColor: '#dcfce7',
              color: '#16a34a',
            }}
          >
            Disetujui
          </Text>
        )
      case 'rejected':
        return (
          <Text
            style={{
              ...baseStyle,
              backgroundColor: '#fee2e2',
              color: '#dc2626',
            }}
          >
            Ditolak
          </Text>
        )
      default:
        return (
          <Text
            style={{
              ...baseStyle,
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
            }}
          >
            {status}
          </Text>
        )
    }
  }

  const getStatusBadgeDetail = (status: string) => {
    const baseStyle = {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      fontSize: 14,
      fontWeight: '600' as const,
    }

    switch (status) {
      case 'pending':
        return (
          <Text
            style={{
              ...baseStyle,
              backgroundColor: '#fef3c7',
              color: '#d97706',
            }}
          >
            Pending
          </Text>
        )
      case 'approved':
        return (
          <Text
            style={{
              ...baseStyle,
              backgroundColor: '#dcfce7',
              color: '#16a34a',
            }}
          >
            Disetujui
          </Text>
        )
      case 'rejected':
        return (
          <Text
            style={{
              ...baseStyle,
              backgroundColor: '#fee2e2',
              color: '#dc2626',
            }}
          >
            Ditolak
          </Text>
        )
      default:
        return (
          <Text
            style={{
              ...baseStyle,
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
            }}
          >
            {status}
          </Text>
        )
    }
  }

  const formatDetailDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const closeFormSheet = () => {
    setFormSheetOpen(false)
  }

  const handleFormSubmit = (formData: FormData) => {
    // Create new request
    const newRequest: RecentRequest = {
      id: Math.max(...recentRequests.map((r) => r.id)) + 1,
      laporan_type: formData.tipeDokumen,
      type: formData.jenis,
      description: formData.deskripsi,
      status: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    }

    setRecentRequests([newRequest, ...recentRequests])
  }

  return (
    <>
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
          </XStack>

          {/* Statistics Cards */}
          <YStack space="$3">
            <H2 fontSize="$4" letterSpacing={0.5} color="$color12">
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
            <H2 fontSize="$4" letterSpacing={0.5} color="$color12">
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
            <H2 fontSize="$4" letterSpacing={0.5} color="$color12">
              Permintaan Terbaru
            </H2>
            <YStack space="$2">
              {recentRequests.map((request) => (
                <Card
                  key={request.id}
                  style={{ padding: 12 }}
                  backgroundColor="$color2"
                  pressStyle={{ backgroundColor: '$color3' }}
                  onPress={() => handleRequestPress(request)}
                >
                  <YStack space="$2">
                    <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text fontSize="$4" fontWeight="bold" color="$color12">
                        {request.laporan_type}
                      </Text>
                      {getStatusBadge(request.status)}
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

      {/* Detail Sheet */}
      <Sheet
        modal
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        snapPoints={[100]}
        dismissOnSnapToBottom={false}
        animation="medium"
      >
        <Sheet.Overlay
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame style={{ backgroundColor: 'white' }}>
          <Sheet.ScrollView>
            {selectedRequest && (
              <YStack style={{ padding: 0 }} space="$0">
                {/* Header with ID */}
                <YStack
                  style={{
                    padding: 24,
                    paddingTop: 60,
                    backgroundColor: '#f8fafc',
                    borderBottomWidth: 1,
                    borderBottomColor: '#e2e8f0',
                  }}
                  space="$3"
                >
                  <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <XStack style={{ alignItems: 'center' }} space="$2">
                      <Hash size={20} color="#64748b" />
                      <Text fontSize="$3" color="#64748b" fontWeight="500">
                        #{selectedRequest.id}
                      </Text>
                    </XStack>
                    <Button size="$3" circular background="$color3" onPress={closeSheet} icon={X} />
                  </XStack>

                  <YStack space="$2">
                    <XStack style={{ alignItems: 'center' }} space="$2">
                      <FileText size={24} color="#1e293b" />
                      <Text fontSize="$6" fontWeight="bold" color="#1e293b">
                        {selectedRequest.laporan_type}
                      </Text>
                    </XStack>
                    <Text fontSize="$3" color="#64748b" textTransform="capitalize">
                      {selectedRequest.type}
                    </Text>
                  </YStack>

                  <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <XStack style={{ alignItems: 'center' }} space="$2">
                      <Clock size={16} color="#64748b" />
                      <Text fontSize="$2" color="#64748b">
                        Dibuat: {formatDetailDate(selectedRequest.created_at)}
                      </Text>
                    </XStack>
                    {getStatusBadgeDetail(selectedRequest.status)}
                  </XStack>
                </YStack>

                {/* Content */}
                <YStack style={{ padding: 24 }} space="$6">
                  {/* Description */}
                  <YStack space="$3">
                    <Text fontSize="$4" fontWeight="bold" color="#1e293b">
                      Deskripsi Permintaan
                    </Text>
                    <Text
                      fontSize="$3"
                      color="#475569"
                      lineHeight={24}
                      style={{
                        backgroundColor: '#f8fafc',
                        padding: 16,
                        borderRadius: 12,
                        borderLeftWidth: 4,
                        borderLeftColor: '#3b82f6',
                      }}
                    >
                      {selectedRequest.description}
                    </Text>
                  </YStack>

                  {/* Attachments */}
                  <YStack space="$3">
                    <XStack style={{ alignItems: 'center' }} space="$2">
                      <Paperclip size={20} color="#1e293b" />
                      <Text fontSize="$4" fontWeight="bold" color="#1e293b">
                        Lampiran
                      </Text>
                    </XStack>

                    <YStack space="$3">
                      {dummyAttachments.map((attachment, index) => (
                        <YStack
                          key={index}
                          style={{
                            backgroundColor: '#f8fafc',
                            borderRadius: 12,
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderColor: '#e2e8f0',
                          }}
                        >
                          <Image
                            source={{ uri: attachment.url }}
                            style={{
                              width: '100%',
                              height: 200,
                              resizeMode: 'cover',
                            }}
                          />
                          <YStack style={{ padding: 16 }} space="$1">
                            <XStack style={{ alignItems: 'center' }} space="$2">
                              <ImageIcon size={16} color="#64748b" />
                              <Text fontSize="$2" color="#64748b" fontWeight="500">
                                {attachment.filename}
                              </Text>
                            </XStack>
                          </YStack>
                        </YStack>
                      ))}
                    </YStack>
                  </YStack>
                </YStack>

                {/* Close Button */}
                <YStack style={{ padding: 24, paddingTop: 0 }}>
                  <Button
                    size="$4"
                    variant="outlined"
                    onPress={closeSheet}
                    style={{
                      borderColor: '#e2e8f0',
                      borderWidth: 1,
                    }}
                  >
                    Tutup
                  </Button>
                </YStack>
              </YStack>
            )}
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>

      {/* Form Sheet */}
      <CreateRequestSheet
        open={formSheetOpen}
        onOpenChange={setFormSheetOpen}
        onSubmit={handleFormSubmit}
        documentTypes={documentTypes}
      />
    </>
  )
}
