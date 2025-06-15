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
  Select,
  Adapt,
  Sheet,
  useToastController,
  Separator,
} from '@my/ui'
import {
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  ChevronDown,
  Check,
  X,
  FileText,
  User,
  CalendarDays,
  Hash,
  Paperclip,
  Image as ImageIcon,
} from '@tamagui/lucide-icons'

interface RequestHistory {
  id: number
  laporan_type: string
  type: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at?: string
}

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

const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
]

const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
]

export default function RiwayatTab() {
  const toast = useToastController()
  const [requests, setRequests] = useState<RequestHistory[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RequestHistory[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDocumentType, setSelectedDocumentType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedRequest, setSelectedRequest] = useState<RequestHistory | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Dummy data for request history
  const dummyRequests: RequestHistory[] = [
    {
      id: 1,
      laporan_type: 'KTP',
      type: 'permintaan',
      description: 'Permintaan pembuatan KTP baru untuk pindah domisili',
      status: 'pending',
      created_at: '2024-01-15 10:30:00',
    },
    {
      id: 2,
      laporan_type: 'KK',
      type: 'permintaan',
      description: 'Permintaan pembuatan Kartu Keluarga baru',
      status: 'approved',
      created_at: '2024-01-14 14:20:00',
      updated_at: '2024-01-16 09:15:00',
    },
    {
      id: 3,
      laporan_type: 'Akta Lahir',
      type: 'permintaan',
      description: 'Pembuatan akta kelahiran untuk anak pertama',
      status: 'rejected',
      created_at: '2024-01-13 09:15:00',
      updated_at: '2024-01-14 16:30:00',
    },
    {
      id: 4,
      laporan_type: 'Buku Nikah',
      type: 'permintaan',
      description: 'Permintaan buku nikah untuk pernikahan',
      status: 'pending',
      created_at: '2024-01-12 16:45:00',
    },
    {
      id: 5,
      laporan_type: 'KIA (Kartu identitas anak)',
      type: 'permintaan',
      description: 'Pembuatan KIA untuk anak usia 5 tahun',
      status: 'approved',
      created_at: '2024-01-11 11:30:00',
      updated_at: '2024-01-13 14:20:00',
    },
    {
      id: 6,
      laporan_type: 'KIS (Kartu Indonesia Sehat)',
      type: 'permintaan',
      description: 'Permintaan KIS untuk keluarga',
      status: 'pending',
      created_at: '2024-01-10 08:20:00',
    },
    {
      id: 7,
      laporan_type: 'Akta Nikah',
      type: 'permintaan',
      description: 'Pembuatan akta nikah untuk pernikahan baru',
      status: 'approved',
      created_at: '2024-01-09 13:45:00',
      updated_at: '2024-01-11 10:30:00',
    },
    {
      id: 8,
      laporan_type: 'Surat Kematian',
      type: 'permintaan',
      description: 'Permintaan surat kematian untuk anggota keluarga',
      status: 'rejected',
      created_at: '2024-01-08 15:10:00',
      updated_at: '2024-01-09 11:25:00',
    },
    {
      id: 9,
      laporan_type: 'KTP',
      type: 'permintaan',
      description: 'Penggantian KTP yang hilang',
      status: 'approved',
      created_at: '2024-01-07 12:00:00',
      updated_at: '2024-01-09 16:45:00',
    },
    {
      id: 10,
      laporan_type: 'KK',
      type: 'permintaan',
      description: 'Perubahan data KK karena pernikahan',
      status: 'pending',
      created_at: '2024-01-06 09:30:00',
    },
  ]

  useEffect(() => {
    setRequests(dummyRequests)
  }, [])

  useEffect(() => {
    filterAndSortRequests()
  }, [requests, selectedStatus, selectedDocumentType, sortBy])

  const filterAndSortRequests = () => {
    let filtered = [...requests]

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((request) => request.status === selectedStatus)
    }

    // Filter by document type
    if (selectedDocumentType !== 'all') {
      filtered = filtered.filter((request) => request.laporan_type === selectedDocumentType)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

    setFilteredRequests(filtered)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setRequests(dummyRequests)
      setRefreshing(false)
      toast.show('Berhasil', {
        message: 'Data berhasil diperbarui',
      })
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'green'
      case 'rejected':
        return 'red'
      case 'pending':
        return 'orange'
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'approved':
        return 'Disetujui'
      case 'rejected':
        return 'Ditolak'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleRequestPress = (request: RequestHistory) => {
    setSelectedRequest(request)
    setSheetOpen(true)
  }

  const closeSheet = () => {
    setSheetOpen(false)
    setSelectedRequest(null)
  }

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

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <YStack style={{ flex: 1, padding: 16 }} space="$4">
          {/* Header */}
          <YStack space="$2">
            <H1 color="$color12">Riwayat Permintaan</H1>
            <Text color="$color10" fontSize="$4">
              Daftar permintaan yang telah dibuat
            </Text>
          </YStack>

          {/* Filters */}
          <Card style={{ padding: 16 }} backgroundColor="$color2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              <XStack space={12} style={{ paddingHorizontal: 12 }}>
                {/* Status Filter */}
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  disablePreventBodyScroll
                >
                  <Select.Trigger
                    width={140}
                    height={38}
                    borderRadius={9999}
                    backgroundColor="#F3F4F6"
                    borderWidth={0}
                    paddingHorizontal={18}
                    justifyContent="center"
                    iconAfter={ChevronDown}
                  >
                    <Select.Value
                      placeholder="Semua Status"
                      style={{ fontSize: 16, color: '#222' }}
                    />
                  </Select.Trigger>
                  <Adapt when="maxMd" platform="touch">
                    <Sheet modal dismissOnSnapToBottom animation="medium">
                      <Sheet.Frame>
                        <Sheet.ScrollView>
                          <Adapt.Contents />
                        </Sheet.ScrollView>
                      </Sheet.Frame>
                      <Sheet.Overlay
                        style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                      />
                    </Sheet>
                  </Adapt>
                  <Select.Content zIndex={200000}>
                    <Select.Viewport width={200}>
                      <Select.Group>
                        {statusOptions.map((option, i) => (
                          <Select.Item index={i} key={option.value} value={option.value}>
                            <Select.ItemText>{option.label}</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Viewport>
                  </Select.Content>
                </Select>

                {/* Document Type Filter */}
                <Select
                  value={selectedDocumentType}
                  onValueChange={setSelectedDocumentType}
                  disablePreventBodyScroll
                >
                  <Select.Trigger
                    width={160}
                    height={38}
                    borderRadius={9999}
                    backgroundColor="#F3F4F6"
                    borderWidth={0}
                    paddingHorizontal={18}
                    justifyContent="center"
                    iconAfter={ChevronDown}
                  >
                    <Select.Value
                      placeholder="Semua Dokumen"
                      style={{ fontSize: 16, color: '#222' }}
                    />
                  </Select.Trigger>
                  <Adapt when="maxMd" platform="touch">
                    <Sheet modal dismissOnSnapToBottom animation="medium">
                      <Sheet.Frame>
                        <Sheet.ScrollView>
                          <Adapt.Contents />
                        </Sheet.ScrollView>
                      </Sheet.Frame>
                      <Sheet.Overlay
                        style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                      />
                    </Sheet>
                  </Adapt>
                  <Select.Content zIndex={200000}>
                    <Select.Viewport width={200}>
                      <Select.Group>
                        <Select.Item index={0} value="all">
                          <Select.ItemText>Semua Dokumen</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={16} />
                          </Select.ItemIndicator>
                        </Select.Item>
                        {documentTypes.map((docType, i) => (
                          <Select.Item index={i + 1} key={docType} value={docType}>
                            <Select.ItemText>{docType}</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Viewport>
                  </Select.Content>
                </Select>

                {/* Sort by Date */}
                <Select value={sortBy} onValueChange={setSortBy} disablePreventBodyScroll>
                  <Select.Trigger
                    width={140}
                    height={38}
                    borderRadius={9999}
                    backgroundColor="#F3F4F6"
                    borderWidth={0}
                    paddingHorizontal={18}
                    justifyContent="center"
                    iconAfter={Calendar}
                  >
                    <Select.Value
                      placeholder="Semua Tanggal"
                      style={{ fontSize: 16, color: '#222' }}
                    />
                  </Select.Trigger>
                  <Adapt when="maxMd" platform="touch">
                    <Sheet modal dismissOnSnapToBottom animation="medium">
                      <Sheet.Frame>
                        <Sheet.ScrollView>
                          <Adapt.Contents />
                        </Sheet.ScrollView>
                      </Sheet.Frame>
                      <Sheet.Overlay
                        style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                      />
                    </Sheet>
                  </Adapt>
                  <Select.Content zIndex={200000}>
                    <Select.Viewport width={200}>
                      <Select.Group>
                        {sortOptions.map((option, i) => (
                          <Select.Item index={i} key={option.value} value={option.value}>
                            <Select.ItemText>{option.label}</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Viewport>
                  </Select.Content>
                </Select>
              </XStack>
            </ScrollView>
          </Card>

          {/* Request List */}
          <YStack space="$3">
            {filteredRequests.length === 0 ? (
              <Card style={{ padding: 32 }} backgroundColor="$color2">
                <YStack style={{ alignItems: 'center' }} space="$2">
                  <Text fontSize="$4" color="$color10" style={{ textAlign: 'center' }}>
                    Tidak ada permintaan yang ditemukan
                  </Text>
                  <Text fontSize="$3" color="$color9" style={{ textAlign: 'center' }}>
                    Coba ubah filter atau buat permintaan baru
                  </Text>
                </YStack>
              </Card>
            ) : (
              <YStack space="$2">
                {filteredRequests.map((request) => (
                  <Card
                    key={request.id}
                    style={{ padding: 16 }}
                    backgroundColor="$color2"
                    pressStyle={{ backgroundColor: '$color3' }}
                    onPress={() => handleRequestPress(request)}
                  >
                    <YStack space="$3">
                      <XStack style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <YStack style={{ flex: 1 }} space="$1">
                          <Text fontSize="$4" fontWeight="bold" color="$color12">
                            {request.laporan_type}
                          </Text>
                          <Text fontSize="$3" color="$color11" numberOfLines={2}>
                            {request.description}
                          </Text>
                        </YStack>
                        <XStack style={{ alignItems: 'center' }} space="$1">
                          {getStatusIcon(request.status)}
                          <Text
                            fontSize="$2"
                            fontWeight="bold"
                            color={getStatusColor(request.status)}
                          >
                            {getStatusLabel(request.status)}
                          </Text>
                        </XStack>
                      </XStack>

                      <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <YStack space="$1">
                          <Text fontSize="$2" color="$color10">
                            Dibuat: {formatDate(request.created_at)}
                          </Text>
                          {request.updated_at && (
                            <Text fontSize="$2" color="$color10">
                              Diperbarui: {formatDate(request.updated_at)}
                            </Text>
                          )}
                        </YStack>
                        <Text fontSize="$2" color="$color9">
                          ID: #{request.id}
                        </Text>
                      </XStack>
                    </YStack>
                  </Card>
                ))}
              </YStack>
            )}
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
                        Dibuat: {formatDate(selectedRequest.created_at)}
                      </Text>
                    </XStack>
                    <XStack style={{ alignItems: 'center' }} space="$2">
                      {getStatusIcon(selectedRequest.status)}
                      <Text
                        fontSize="$2"
                        fontWeight="bold"
                        color={getStatusColor(selectedRequest.status)}
                      >
                        {getStatusLabel(selectedRequest.status)}
                      </Text>
                    </XStack>
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

                  {/* Updated Time */}
                  {selectedRequest.updated_at && (
                    <YStack
                      style={{
                        backgroundColor: '#f8fafc',
                        padding: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#e2e8f0',
                      }}
                      space="$2"
                    >
                      <XStack style={{ alignItems: 'center' }} space="$2">
                        <CalendarDays size={16} color="#64748b" />
                        <Text fontSize="$3" fontWeight="500" color="#64748b">
                          Terakhir Diperbarui
                        </Text>
                      </XStack>
                      <Text fontSize="$2" color="#94a3b8">
                        {formatDate(selectedRequest.updated_at)}
                      </Text>
                    </YStack>
                  )}
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
    </>
  )
}
