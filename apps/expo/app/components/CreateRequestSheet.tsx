import React, { useState } from 'react'
import { Image } from 'react-native'
import {
  YStack,
  XStack,
  Text,
  H2,
  Button,
  Card,
  Sheet,
  Select,
  Adapt,
  Label,
  useToastController,
  RadioGroup,
} from '@my/ui'
import { Input, TextArea } from '@tamagui/input'
import { X, ChevronDown, Check, Upload, Image as ImageIcon } from '@tamagui/lucide-icons'

interface CreateRequestSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (formData: FormData) => void
  documentTypes: string[]
}

export interface FormData {
  judul: string
  deskripsi: string
  tipeDokumen: string
  jenis: string
  attachments: Array<{ uri: string; filename: string }>
}

export function CreateRequestSheet({
  open,
  onOpenChange,
  onSubmit,
  documentTypes,
}: CreateRequestSheetProps) {
  const toast = useToastController()
  const [formData, setFormData] = useState<FormData>({
    judul: '',
    deskripsi: '',
    tipeDokumen: '',
    jenis: 'permintaan',
    attachments: [],
  })

  const closeFormSheet = () => {
    onOpenChange(false)
    setFormData({
      judul: '',
      deskripsi: '',
      tipeDokumen: '',
      jenis: 'permintaan',
      attachments: [],
    })
  }

  const handleFormSubmit = () => {
    if (!formData.judul || !formData.deskripsi || !formData.tipeDokumen) {
      toast.show('Error', {
        message: 'Mohon lengkapi semua field yang diperlukan',
      })
      return
    }

    onSubmit(formData)
    closeFormSheet()
    toast.show('Berhasil', {
      message: 'Permintaan berhasil dibuat',
    })
  }

  const handleImageUpload = () => {
    // Simulate image upload - in real app, this would open image picker
    const dummyImage = {
      uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      filename: `attachment_${Date.now()}.jpg`,
    }
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, dummyImage],
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
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
          <YStack style={{ padding: 24, paddingTop: 60 }} space="$6">
            {/* Header */}
            <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <H2 color="$color12">Buat Permintaan Baru</H2>
              <Button size="$3" circular background="$color3" onPress={closeFormSheet} icon={X} />
            </XStack>

            {/* Form */}
            <YStack space="$4">
              {/* Judul */}
              <YStack space="$2">
                <Label htmlFor="judul" fontSize="$3" fontWeight="500" color="$color11">
                  Judul Permintaan
                </Label>
                <Input
                  id="judul"
                  placeholder="Masukkan judul permintaan"
                  value={formData.judul}
                  onChangeText={(e) =>
                    setFormData((prev) => ({ ...prev, judul: e.nativeEvent.text }))
                  }
                  size="$4"
                  borderColor="$color7"
                  focusStyle={{ borderColor: '$blue10' }}
                />
              </YStack>

              {/* Deskripsi */}
              <YStack space="$2">
                <Label htmlFor="deskripsi" fontSize="$3" fontWeight="500" color="$color11">
                  Deskripsi
                </Label>
                <TextArea
                  id="deskripsi"
                  placeholder="Jelaskan detail permintaan Anda"
                  value={formData.deskripsi}
                  onChangeText={(e) =>
                    setFormData((prev) => ({ ...prev, deskripsi: e.nativeEvent.text }))
                  }
                  size="$4"
                  borderColor="$color7"
                  focusStyle={{ borderColor: '$blue10' }}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </YStack>

              {/* Tipe Dokumen */}
              <YStack space="$2">
                <Label htmlFor="tipeDokumen" fontSize="$3" fontWeight="500" color="$color11">
                  Tipe Dokumen
                </Label>
                <Select
                  value={formData.tipeDokumen}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, tipeDokumen: value }))
                  }
                  disablePreventBodyScroll
                >
                  <Select.Trigger
                    size="$4"
                    borderColor="$color7"
                    focusStyle={{ borderColor: '$blue10' }}
                    iconAfter={ChevronDown}
                  >
                    <Select.Value placeholder="Pilih tipe dokumen" />
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
                    <Select.Viewport width={300}>
                      <Select.Group>
                        {documentTypes.map((docType, i) => (
                          <Select.Item index={i} key={docType} value={docType}>
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
              </YStack>

              {/* Jenis */}
              <YStack space="$2">
                <Label fontSize="$3" fontWeight="500" color="$color11">
                  Jenis
                </Label>
                <RadioGroup
                  value={formData.jenis}
                  onValueChange={(value) => {
                    if (value) {
                      setFormData((prev) => ({ ...prev, jenis: value }))
                    }
                  }}
                  name="jenis"
                >
                  <XStack space="$4" style={{ flexWrap: 'wrap' }}>
                    <XStack space="$2" style={{ alignItems: 'center' }}>
                      <RadioGroup.Item value="permintaan" id="permintaan">
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Label htmlFor="permintaan" fontSize="$3" color="$color11" fontWeight="500">
                        Permintaan
                      </Label>
                    </XStack>
                    <XStack space="$2" style={{ alignItems: 'center' }}>
                      <RadioGroup.Item value="pelaporan" id="pelaporan">
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Label htmlFor="pelaporan" fontSize="$3" color="$color11" fontWeight="500">
                        Pelaporan
                      </Label>
                    </XStack>
                  </XStack>
                </RadioGroup>
              </YStack>

              {/* Attachments */}
              <YStack space="$3">
                <Label fontSize="$3" fontWeight="500" color="$color11">
                  Lampiran
                </Label>

                {/* Upload Button */}
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={handleImageUpload}
                  icon={Upload}
                  borderColor="$color7"
                  color="$color11"
                >
                  Upload Gambar
                </Button>

                {/* Attachments List */}
                {formData.attachments.length > 0 && (
                  <YStack space="$2">
                    {formData.attachments.map((attachment, index) => (
                      <Card key={index} style={{ padding: 12 }} backgroundColor="$color2">
                        <XStack style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                          <XStack style={{ alignItems: 'center' }} space="$2">
                            <ImageIcon size={16} color="$color10" />
                            <Text fontSize="$2" color="$color11" numberOfLines={1}>
                              {attachment.filename}
                            </Text>
                          </XStack>
                          <Button
                            size="$2"
                            circular
                            background="$red8"
                            color="white"
                            onPress={() => removeAttachment(index)}
                            icon={X}
                          />
                        </XStack>
                      </Card>
                    ))}
                  </YStack>
                )}
              </YStack>
            </YStack>

            {/* Submit Button */}
            <Button
              size="$4"
              background="$blue10"
              color="white"
              onPress={handleFormSubmit}
              style={{ marginTop: 16 }}
            >
              Buat Permintaan
            </Button>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
