import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Card, Col, Form, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
    modifySuccess: 'Chỉnh sửa {objectName} thành công',
});

const TagModal = ({ open, onCancel, data, tagOptions, executeModifyTag, setList }) => {
    const [isChanged, setChange] = useState(false);
    const translate = useTranslate();
    const intl = useIntl();
    const [form] = Form.useForm();
    const notification = useNotification();

    const modifyTag = (values) => {
        executeModifyTag({
            data: {
                callTime: data.callTime,
                deviceId: data?.device?.id,
                duration: data.duration,
                id: data.id,
                phoneNumber: data.phoneNumber,
                tagId: values.tagId,
                type: data.type,
                address: data.address,
                communeId: data?.commune?.id,
                provinceId: data?.province?.id,
                districtId: data?.district?.id,
                email: data?.email,
                phone: data?.phone,
                name: data?.name,
            },
            onCompleted: () => {
                onCancel();
                const tag = tagOptions.find((tag) => tag.value === values.tagId) || null;
                updateRow({ ...data, tag });
                notification({
                    message: intl.formatMessage(messages.modifySuccess, {
                        objectName: translate.formatMessage(commonMessage.tag),
                    }),
                });
                setChange(false);
            },
            onError: (e) => {
                console.log(e);
            },
        });
    };

    const updateRow = (updatedItem) => {
        setList((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    };

    useEffect(() => {
        form.setFieldsValue({ tagId: data?.tag?.id ?? null });
    }, [data]);

    return (
        <Modal
            centered
            open={open}
            onCancel={onCancel}
            footer={null}
            title={translate.formatMessage(commonMessage.modifyTag)}
        >
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} size="100%" onFinish={modifyTag}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <SelectField
                                label="Tag"
                                name="tagId"
                                optionValue="value"
                                options={(tagOptions || []).map((option) => ({
                                    ...option,
                                    label: (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {option.label}
                                            <div
                                                style={{
                                                    width: 50,
                                                    height: 20,
                                                    backgroundColor: option.color,
                                                    marginLeft: 8,
                                                }}
                                            />
                                        </div>
                                    ),
                                }))}
                                optionLabelProp="label"
                                onChange={() => setChange(true)}
                            />
                        </Col>
                    </Row>
                    <div style={{ float: 'right' }}>
                        <Button type="primary" htmlType="submit" disabled={!isChanged}>
                            {translate.formatMessage(commonMessage.modify)}
                        </Button>
                    </div>
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default TagModal;
