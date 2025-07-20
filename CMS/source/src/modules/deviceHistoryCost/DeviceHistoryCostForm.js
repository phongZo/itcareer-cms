import React, { useEffect } from 'react';
import { Card, Col, Row, Form } from 'antd';
import { BaseForm } from '@components/common/form/BaseForm';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import { CATEGORY_KIND_DEVICE_HISTORY_COST } from '@constants';
import FileUploadComponent from './FileUploadComponent';
import InputTextField from '@components/common/form/InputTextField';
import useQueryParams from '@hooks/useQueryParams';
import { formatCurrency, parseCurrency } from '@utils';
import useFetch from '@hooks/useFetch';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';

const DeviceHistoryCostForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const { params } = useQueryParams();
    const translate = useTranslate();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({ onSubmit, setIsChangedFormValues });

    const { data: deviceList } = useFetch(apiConfig.device.getListForAdmin, {
        immediate: true,
        mappingData: (res) => res?.data?.content || [],
    });

    const devices = deviceList?.map((item) => ({ value: item.id, label: `${item.brand} ${item.model}` }));

    const isDeviceIdLocked = !!params.get('deviceId') || !!dataDetail?.device?.id;

    useEffect(() => {
        form.setFieldsValue({
            deviceId: dataDetail?.device?.id || Number(params.get('deviceId')) || '',
            cost: dataDetail?.cost ? formatCurrency(dataDetail.cost) : '0',
            reason: dataDetail?.reason || '',
            description: dataDetail?.description || '',
            deviceCostDocumentations:
                dataDetail?.deviceCostDocumentations?.map((doc) => ({
                    id: doc.id,
                    fileName: doc.fileName,
                    ext: doc.ext,
                    url: doc.url,
                })) || [],
            categoryId: dataDetail?.category?.id,
        });
    }, [dataDetail, form]);
    

    const handleSubmit = (values) => {
        const payload = {
            categoryId: values.categoryId,
            cost: parseCurrency(values.cost),
            description: values.description,
            deviceCostDocumentations: values.deviceCostDocumentations || [],
            deviceId: dataDetail?.device?.id || Number(params.get('deviceId')) || Number(params.get('id')),
            reason: values.reason,
        };
        console.log(payload.deviceId);
        mixinFuncs.handleSubmit(payload);
    };

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.device)}
                            required
                            name="deviceId"
                            options={devices}
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            disabled={isDeviceIdLocked}
                        />
                    </Col>
                    <Col span={12}>
                        <Col span={24}>
                            <InputTextField
                                required
                                label={translate.formatMessage(commonMessage.cost)}
                                name="cost"
                                requiredMsg={translate.formatMessage(commonMessage.required)}
                                onChange={(e) => {
                                    const formatted = formatCurrency(e.target.value);
                                    form.setFieldsValue({ cost: formatted });
                                }}
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            const raw = parseCurrency(value);
                                            if (raw > 0) return Promise.resolve();
                                            return Promise.reject(
                                                new Error(
                                                    translate.formatMessage(commonMessage.costMustBeGreaterThanZero),
                                                ),
                                            );
                                        },
                                    },
                                ]}
                            />
                        </Col>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            required
                            label={translate.formatMessage(commonMessage.category)}
                            name="categoryId"
                            apiConfig={apiConfig.category.getList}
                            mappingOptions={(category) => ({
                                value: category.id,
                                label: category.name,
                            })}
                            initialSearchParams={{ kind: CATEGORY_KIND_DEVICE_HISTORY_COST }}
                            searchParams={(searchText) => ({ keyword: searchText })}
                            debounceTime={500}
                            showSearch={false}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.reason)} name="reason" />
                    </Col>
                </Row>

                <Row style={{ marginTop: 12 }}>
                    <Col span={24}>
                        <TextField
                            type="textarea"
                            label={translate.formatMessage(commonMessage.description)}
                            name="description"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item name="deviceCostDocumentations" noStyle>
                            <FileUploadComponent
                                label={translate.formatMessage(commonMessage.documents)}
                                name="deviceCostDocumentations"
                                form={form}
                                fileData={dataDetail?.deviceCostDocumentations || []}
                                setIsChangedFormValues={setIsChangedFormValues}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DeviceHistoryCostForm;
