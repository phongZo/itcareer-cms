import React, { useEffect } from 'react';
import { Card, Col, Row } from 'antd';

import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import useQueryParams from '@hooks/useQueryParams';

const DeviceEmployeeForm = (props) => {
    const translate = useTranslate();
    const { params } = useQueryParams();
    const employeeId = +params.get('employeeId');

    const { data: deviceList } = useFetch(apiConfig.device.getListForClient, {
        immediate: true,
        mappingData: (res) => res?.data?.content || [],
    });
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, groups, branchs, isEditing } = props;

    const devices = deviceList
        ?.filter((item) =>
            isEditing
                ? !(item?.employee?.id === employeeId && item.id !== dataDetail?.device?.id) || !item.employee
                : !item.employee,
        )
        .map((item) => ({ value: item.id, label: `${item.brand} ${item.model}` }));

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, employeeId: params.get('employeeId') });
    };

    useEffect(() => {
        form.setFieldsValue({
            employee: params.get('fullName'),
            deviceId: +dataDetail?.device?.id,
        });
    }, [dataDetail]);

    useEffect(() => {
        form.setFieldsValue({
            deviceId: dataDetail?.device?.id,
            employeeId: dataDetail?.employee?.id,
            note: dataDetail?.note,
        });
    }, [dataDetail]);

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
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.employee)}
                            required
                            name="employee"
                            disabled
                            optionLabelProp="label"
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <TextField label={translate.formatMessage(commonMessage.note)} type="textarea" name="note" />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};
export default DeviceEmployeeForm;
