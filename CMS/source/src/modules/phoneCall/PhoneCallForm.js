import React, { useEffect, useState } from 'react';
import { Card, Col, Empty, Row } from 'antd';

import { BaseForm } from '@components/common/form/BaseForm';

import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';

import { commonMessage } from '@locales/intl';
import DatePickerField from '@components/common/form/DatePickerField';
import SelectField from '@components/common/form/SelectField';
import { DEFAULT_FORMAT, PHONE_CALL_TYPE_CANCELED, PHONE_CALL_TYPE_MISSING, TIME_FORMAT_FULL } from '@constants';
import { phoneCallTypeOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import dayjs from 'dayjs';
import { dateMustBeforeNowValidator } from '@utils/formValidator';
import TimePickerField from '@components/common/form/TimePickerField';
import { convertSecondToTimeFormatFull, convertTimeFormatFullToSeconds } from '@utils';

const PhoneCallForm = (props) => {
    const translate = useTranslate();

    const phoneCallTypeValues = translate.formatKeys(phoneCallTypeOptions, ['label']);

    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, groups, branchs, isEditing } = props;
    const [isDurationDisabled, setIsDurationDisabled] = useState(false);

    const { data: deviceList } = useFetch(apiConfig?.device?.getListForClient, {
        immediate: true,
        mappingData: (response) => response?.data?.content || [],
    });
    const deviceOptions = deviceList?.map((device) => ({
        value: device.id,
        label: `${device?.brand} ${device.model}`,
    }));

    const phoneNumberList = deviceList?.map((device) => ({
        value: device?.simNumber,
        label: device?.simNumber,
    }));

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        values.callTime = dayjs(values.callTime).format(DEFAULT_FORMAT);
        values.duration = convertTimeFormatFullToSeconds(values.duration);
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            phoneNumber: dataDetail?.phoneNumber,
            callTime: dataDetail?.callTime
                ? dayjs(dataDetail?.callTime, DEFAULT_FORMAT).isValid()
                    ? dayjs(dataDetail?.callTime, DEFAULT_FORMAT)
                    : null
                : null,
            duration: convertSecondToTimeFormatFull(dataDetail?.duration) || dayjs('00:00:00', TIME_FORMAT_FULL),
            type: dataDetail?.type,
            deviceId: dataDetail?.device?.id,
        });
        setIsDurationDisabled(
            dataDetail?.type === PHONE_CALL_TYPE_MISSING || dataDetail?.type === PHONE_CALL_TYPE_CANCELED,
        );
    }, [dataDetail]);
    const handleChange = () => {
        const typeValue = form.getFieldValue('type');
        const isDisabled = typeValue === PHONE_CALL_TYPE_MISSING || typeValue === PHONE_CALL_TYPE_CANCELED;

        setIsDurationDisabled(isDisabled);

        if (isDisabled) {
            form.setFieldValue('duration', dayjs('00:00:00', TIME_FORMAT_FULL));
        }

        onValuesChange();
    };

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={handleChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.phone)}
                            required
                            name="phoneNumber"
                            allowClear={false}
                            placeholder={translate.formatMessage(commonMessage.phone)}
                            notFoundContent={<Empty description={translate.formatMessage(commonMessage.noData)} />}
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            options={phoneNumberList}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.device)}
                            required
                            name="deviceId"
                            allowClear={false}
                            placeholder={translate.formatMessage(commonMessage.device)}
                            notFoundContent={<Empty description={translate.formatMessage(commonMessage.noData)} />}
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            options={deviceOptions}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <DatePickerField
                            label={translate.formatMessage(commonMessage.callTime)}
                            style={{ width: '100%' }}
                            format={DEFAULT_FORMAT}
                            showTime
                            placeholder={translate.formatMessage(commonMessage.callTime)}
                            name="callTime"
                            required
                            rules={[
                                {
                                    validator: (_, value) =>
                                        dateMustBeforeNowValidator(
                                            _,
                                            value,
                                            translate,
                                            commonMessage.callTimeMustBeforeNow,
                                        ),
                                },
                            ]}
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                        />
                    </Col>
                    <Col span={12}>
                        <TimePickerField
                            label={translate.formatMessage(commonMessage.duration)}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            width={'100%'}
                            format={TIME_FORMAT_FULL}
                            placeholder={translate.formatMessage(commonMessage.duration)}
                            fieldName="duration"
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            disabled={isDurationDisabled}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.type)}
                            required
                            name="type"
                            allowClear={false}
                            options={phoneCallTypeValues}
                            notFoundContent={<Empty description={translate.formatMessage(commonMessage.noData)} />}
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};
export default PhoneCallForm;
