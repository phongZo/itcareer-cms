import React, { useEffect } from 'react';
import { Card, Col, Row } from 'antd';

import { confirmPasswordValidator, emailValidator, passwordValidator, phoneValidator } from '@utils/formValidator';

import apiConfig from '@constants/apiConfig';
import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import SelectField from '@components/common/form/SelectField';
import { messageStatusOptions, messageTypeOptions } from '@constants/masterData';

const MessageForm = (props) => {
    const translate = useTranslate();

    const messageStatusValues = translate.formatKeys(messageStatusOptions, ['label']);
    const messageTypeValues = translate.formatKeys(messageTypeOptions, ['label']);

    const { data: employeeList } = useFetch(apiConfig.employee.getList, {
        immediate: true,
        mappingData: (res) => res?.data?.content || [],
    });

    const employees = employeeList?.map((item) => ({ value: item.id, label: item.account.fullName }));

    const { data: deviceList } = useFetch(apiConfig.device.getListForAdmin, {
        immediate: true,
        mappingData: (res) => res?.data?.content || [],
    });

    const devices = deviceList?.map((item) => ({ value: item.id, label: `${item.brand} ${item.model}` }));

    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, groups, branchs, isEditing } = props;

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            employeeId: dataDetail?.employee?.id,
            deviceId: dataDetail?.device?.id,
            phoneNumber: dataDetail?.phoneNumber,
            isRead: dataDetail?.isRead ? 1 : 0,
            type: dataDetail?.type,
            message: dataDetail?.message,
        });
    }, [dataDetail]);
    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.employee)}
                            required
                            name="employeeId"
                            options={employees}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.device)}
                            required
                            name="deviceId"
                            options={devices}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.phone)}
                            name="phoneNumber"
                            type="phone"
                            rules={[
                                {
                                    validator: (_, value) => phoneValidator(_, value, translate),
                                },
                            ]}/>
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.type)}
                            required
                            name="type"
                            options={messageTypeValues}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.status)}
                            required
                            name="isRead"
                            options={messageStatusValues}
                            disabled={!isEditing}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(commonMessage.message)}
                            required
                            name="message"
                            type="textarea"
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default MessageForm;
