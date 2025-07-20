import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';

import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import SelectField from '@components/common/form/SelectField';

import { checkDuplicateSerial, checkSimNumber } from '@utils/formValidator';

import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import useListDevice from './useDeviceList';

import { DEVICE_PLATFORMS } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import apiConfig from '@constants/apiConfig';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { CATEGORY_KIND_DEVICE } from '@constants';
import useFetch from '@hooks/useFetch';

const DeviceForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues } = {}) => {
    const translate = useTranslate();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const { data: devices } = useListDevice();

    const { data: deviceEmployee } = useFetch(apiConfig.deviceEmployee.getList, {
        immediate: true,
        params: {
            deviceId: dataDetail?.id,
        },
        mappingData: (res) => res?.data?.content[0] || {},
    });
    const { execute: executeCreateDeviceEmployee } = useFetch(apiConfig.deviceEmployee.create, {
        immediate: false,
    });
    const { execute: executeUpdateDeviceEmployee } = useFetch(apiConfig.deviceEmployee.update, {
        immediate: false,
    });
    const { execute: executeDeleteDeviceEmployee } = useFetch(apiConfig.deviceEmployee.delete, {
        immediate: false,
    });
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            categoryId: dataDetail?.category?.id,
            employeeId: dataDetail?.employee?.id,
        });
    }, [dataDetail, form]);

    const handleSubmit = (values) => {
        mixinFuncs.handleSubmit(values);
        if (!values?.employeeId && deviceEmployee?.id) {
            executeDeleteDeviceEmployee({
                pathParams: {
                    id: deviceEmployee?.id,
                },
            });
        } else if (values?.employeeId && !dataDetail?.employee) {
            executeCreateDeviceEmployee({
                data: {
                    employeeId: values.employeeId,
                    deviceId: dataDetail?.id,
                },
            });
        } else if (values?.employeeId && dataDetail?.employee) {
            executeUpdateDeviceEmployee({
                data: {
                    employeeId: values.employeeId,
                    deviceId: dataDetail?.id,
                    id: deviceEmployee?.id,
                },
            });
        }
    };

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(commonMessage.brand)}
                            name="brand"
                            required
                            apiConfig={apiConfig.category.getListForBrand}
                            mappingOptions={(brand) => ({
                                value: brand.name,
                                label: brand.name,
                            })}
                            initialSearchParams={{}}
                            searchParams={(searchText) => ({ keyword: searchText })}
                            debounceTime={500}
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.model)}
                            name="model"
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(commonMessage.category)}
                            name="categoryId"
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            apiConfig={apiConfig.category.getList}
                            mappingOptions={(category) => ({
                                value: category.id,
                                label: category.name,
                            })}
                            initialSearchParams={{ kind: CATEGORY_KIND_DEVICE }}
                            searchParams={(searchText) => ({ keyword: searchText })}
                            debounceTime={500}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.platform)}
                            name="platform"
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            required
                            options={DEVICE_PLATFORMS}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.serial)}
                            name="serial"
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            rules={[
                                {
                                    validator: (rule, value) =>
                                        checkDuplicateSerial(rule, value, translate, devices, dataDetail),
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.simNumber)}
                            name="simNumber"
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            rules={[
                                {
                                    validator: (rule, value) =>
                                        checkSimNumber(rule, value, translate, devices, dataDetail),
                                },
                            ]}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(commonMessage.employee)}
                            name="employeeId"
                            apiConfig={apiConfig.employee.getList}
                            mappingOptions={(employee) => ({
                                value: employee.id,
                                label: employee?.account?.fullName,
                            })}
                            initialSearchParams={{}}
                            searchParams={(searchText) => ({ keyword: searchText })}
                            debounceTime={500}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DeviceForm;
