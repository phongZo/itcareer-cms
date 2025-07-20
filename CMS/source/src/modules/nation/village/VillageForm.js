import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import useTranslate from '@hooks/useTranslate';
import { BaseForm } from '@components/common/form/BaseForm';
import { commonMessage } from '@locales/intl';
import { VILLAGE_KIND } from '@constants';

const VillageForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {
    const translate = useTranslate();

    const queryParameters = new URLSearchParams(window.location.search);
    const districtId = queryParameters.get('districtId');
    const districtName = queryParameters.get('districtName');
    const provinceName = queryParameters.get('provinceName');

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            parentId: districtId,
            kind: VILLAGE_KIND,
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            kind: VILLAGE_KIND,
        });
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            disabled={true}
                            label={translate.formatMessage(commonMessage.Province)}
                            name="provinceName"
                            initialValue={provinceName}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            disabled={true}
                            label={translate.formatMessage(commonMessage.District)}
                            name="districtName"
                            initialValue={districtName}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            label={translate.formatMessage(commonMessage.Village)}
                            name="name"
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            type="textarea"
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            label={translate.formatMessage(commonMessage.description)}
                            name="description"
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default VillageForm;
