import { FC } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DocumentPicker, { types } from '@react-native-documents/picker';

export interface FileData {
    uri: string;
    name: string;
    type: string;
    size: number;
}

interface FileUploadInputProps {
    value?: FileData | null;
    onChange?: (file: FileData | null) => void;
    label?: string;
    placeholder?: string;
    fileType?: 'image' | 'pdf' | 'all';
    maxSize?: number;
    required?: boolean;
    error?: string;
}

const FileUploadInput: FC<FileUploadInputProps> = ({
    value,
    onChange,
    label,
    placeholder = '选择文件',
    fileType = 'all',
    maxSize = 5,
    required = false,
    error,
}) => {

    const getPickerTypes = () => {
        switch (fileType) {
            case 'image':
                return [types.images];
            case 'pdf':
                return [types.pdf];
            default:
                return [types.allFiles];
        }
    };

    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: getPickerTypes()
            })
            const file = result[0];
            // 验证文件大小
            const maxSizeBytes = maxSize * 1024 * 1024;
            if (file.size && file.size > maxSizeBytes) {
                Alert.alert("Error", `The File size isn't ranther more than ${maxSize}MB`)
            }

            const fileData: FileData = {
                uri: file.uri,
                name: file.name || 'unknown',
                type: file.type || 'application/octet-stream',
                size: file.size || 0,
            }

            onChange?.(fileData);
        } catch (error) {
            Alert.alert('错误', '选择文件失败');
        }
    }

    const handleRemoveFile = () => {
        onChange?.(null);
    }

    const isImage = value?.type.startsWith('image/');

    return (
        <View style={styles.container}>
            {
                label && (
                    <Text style={styles.label}>
                        {`${label}`} {(required && '*')}
                    </Text>
                )
            }

            {!value ? (
                <TouchableOpacity onPress={handlePickFile} style={[
                    styles.selectButton,
                    error && styles.errorBorder,
                ]}>
                    <Text style={styles.selectButtonText}>{placeholder}</Text>
                </TouchableOpacity>
            ) : <View style={[styles.previewContainer, error && styles.errorBorder]}>
                {
                    isImage ? (
                        <Image source={{ uri: value.uri }} style={styles.imagePreview} resizeMode="cover" />
                    ) : (
                        <View style={styles.fileIconContainer}>
                            <Text style={styles.fileIcon}>
                                {fileType === 'pdf' ? '📄' : '📁'}
                            </Text>
                        </View>
                    )
                }
                {value && (
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={handleRemoveFile}
                    >
                        <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>}

            {error && <Text style={styles.errorText}>{error}</Text>}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    label: {
        fontSize: 16,
        color: '#103947',
        marginBottom: 10,
    },
    required: {
        color: 'red',
    },
    selectButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectButtonText: {
        color: '#103947',
        fontSize: 14,
    },
    disabledButton: {
        backgroundColor: '#e0e0e0',
    },
    errorBorder: {
        borderColor: 'red',
    },
    previewContainer: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    fileIconContainer: {
        width: '100%',
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 10,
    },
    fileIcon: {
        fontSize: 50,
    },
    fileInfo: {
        gap: 5,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#103947',
    },
    fileSize: {
        fontSize: 12,
        color: '#666',
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});

export default FileUploadInput;