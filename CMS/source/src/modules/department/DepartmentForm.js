import React, { useEffect } from 'react';
import { Card, Col, Row } from 'antd';

import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { showErrorMessage } from '@services/notifyService';

const DepartmentForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing } = props;

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const { data: departments } = useFetch(apiConfig.department.getList, {
        immediate: true,
        mappingData: (response) => response?.data?.content || [],
    });

    const handleSubmit = (values) => {
        const departmentName = departments?.find(
            (department) => department.name.trim() === values.name.trim() && department.id !== dataDetail?.id,
        );

        if (departmentName) {
            form.setFields([
                {
                    name: 'name',
                    errors: [translate.formatMessage(commonMessage.departmentNameExisted)],
                },
            ]);
            showErrorMessage(translate.formatMessage(commonMessage.departmentNameExisted), translate);
            return;
        } else {
            form.setFields([
                {
                    name: 'name',
                    errors: [],
                },
            ]);
        }

        mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            name: dataDetail?.name,
            description: dataDetail?.description,
        });
    }, [dataDetail, form]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.departmentName)}
                            name="name"
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            type="textarea"
                            label={translate.formatMessage(commonMessage.description)}
                            name="description"
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DepartmentForm;
