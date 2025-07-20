import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import useTranslate from '@hooks/useTranslate';
import { BaseForm } from '@components/common/form/BaseForm';
import { commonMessage } from '@locales/intl';
import { DISTRICT_KIND } from '@constants';

const DistrictForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {
    const translate = useTranslate();

    const queryParameters = new URLSearchParams(window.location.search);
    const parentId = queryParameters.get('provinceId');
    const provinceName = queryParameters.get('provinceName');

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            parentId: parentId,
            kind: DISTRICT_KIND,
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField
                            required
                            disabled={true}
                            label={translate.formatMessage(commonMessage.Province)}
                            name="provinceName"
                            initialValue={provinceName}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField required label={translate.formatMessage(commonMessage.District)} name="name" />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={24}>
                        <TextField
                            type="textarea"
                            name="description"
                            required
                            label={translate.formatMessage(commonMessage.description)}
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DistrictForm;
