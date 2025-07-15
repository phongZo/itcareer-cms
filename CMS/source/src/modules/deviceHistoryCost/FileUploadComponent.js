import React, { useState, useEffect } from 'react';
import { Upload, Input, Button, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';

const FileUploadComponent = ({ label, name, form, fileData = [], setIsChangedFormValues = () => {} }) => {
    const [fields, setFields] = useState([]);

    useEffect(() => {
        if (fileData.length > 0) {
            setFields(
                fileData.map((file, index) => ({
                    id: index + 1,
                    file: null,
                    fileName: file.fileName || `File ${index + 1}`,
                    uploaded: true,
                    filePath: file.url,
                    ext: file.ext || '',
                })),
            );
        } else {
            setFields([{ id: 1, file: null, fileName: '', uploaded: false, filePath: null, ext: null }]);
        }
    }, [fileData]);

    const { execute: executeUploadFile } = useFetch(apiConfig.file.upload);

    const handleAddField = () => {
        setFields((prevFields) => [
            ...prevFields,
            { id: prevFields.length + 1, file: null, fileName: '', uploaded: false, filePath: null, ext: null },
        ]);
    };

    const handleRemoveField = (id) => {
        setFields((prevFields) => {
            const updatedFields = prevFields.filter((field) => field.id !== id);
            updateFormValue(updatedFields);
            return updatedFields;
        });
        setIsChangedFormValues(true);
    };

    const handleUpload = (file, fieldId, customFileName = null) => {
        executeUploadFile({
            data: {
                type: 'IMAGE',
                file: file,
                fileName: customFileName || file.name,
            },
            onCompleted: (response) => {
                if (response?.result === true && response?.data?.filePath) {
                    const { filePath, fileName, ext } = response.data;
                    setFields((prevFields) => {
                        const updatedFields = prevFields.map((field) =>
                            field.id === fieldId
                                ? {
                                    ...field,
                                    file, // Lưu file gốc để sử dụng khi đổi tên
                                    fileName: customFileName || fileName || file.name,
                                    uploaded: true,
                                    filePath: filePath,
                                    ext: ext,
                                }
                                : field,
                        );
                        updateFormValue(updatedFields);
                        return updatedFields;
                    });
                    setIsChangedFormValues(true);
                }
            },
        });
        return false;
    };

    const fetchFileFromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = url.split('/').pop(); // Lấy tên file từ URL nếu cần
        return new File([blob], fileName, { type: blob.type });
    };

    const handleFileNameChange = async (e, fieldId) => {
        const newFileName = e.target.value;
        setIsChangedFormValues(true);
        setFields((prevFields) => {
            const updatedFields = prevFields.map((field) => {
                if (field.id === fieldId) {
                    // Nếu đã có file gốc, upload lại với tên mới
                    if (field.file) {
                        handleUpload(field.file, fieldId, newFileName);
                    }
                    // Nếu file từ fileData (đã upload trước đó), tải file từ URL và upload lại
                    else if (field.uploaded && field.filePath) {
                        fetchFileFromUrl(field.filePath).then((file) => {
                            handleUpload(file, fieldId, newFileName);
                        });
                    }
                    return { ...field, fileName: newFileName };
                }
                return field;
            });
            updateFormValue(updatedFields);
            return updatedFields;
        });
    };

    const updateFormValue = (updatedFields) => {
        const fileData = updatedFields
            .filter((field) => field.uploaded)
            .map((field, index) => ({
                ext: field.ext,
                fileName: field.fileName,
                //id: index + 1,
                url: field.filePath,
            }));
        form.setFieldsValue({ [name]: fileData });
    };

    return (
        <>
            {label && <h3 style={{ marginBlock: 0, marginBottom: 4 }}>{label}</h3>}
            <Row gutter={16}>
                {fields.map((field) => (
                    <Col key={field.id} span={24}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <Upload beforeUpload={(file) => handleUpload(file, field.id)} showUploadList={false}>
                                <UploadOutlined
                                    style={{
                                        fontSize: '24px',
                                        cursor: field.uploaded ? 'not-allowed' : 'pointer',
                                        color: field.uploaded ? '#d9d9d9' : '#1890ff',
                                    }}
                                />
                            </Upload>
                            <Input
                                placeholder="New name file"
                                value={field.fileName}
                                onChange={(e) => handleFileNameChange(e, field.id)}
                                style={{ marginLeft: 8, marginRight: 8 }}
                                disabled={false} // Luôn cho phép đổi tên
                            />
                            <MinusCircleOutlined onClick={() => handleRemoveField(field.id)} />
                        </div>
                    </Col>
                ))}
                <Button type="dashed" onClick={handleAddField} icon={<PlusOutlined />}>
                    Add field
                </Button>
            </Row>
        </>
    );
};

export default FileUploadComponent;
