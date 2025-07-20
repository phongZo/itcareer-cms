import React, { useEffect } from 'react';
import { Card, Col, Row } from 'antd';

import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import ColorPickerFieldV1 from '@components/common/form/ColorPickerFieldV1';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { useParams } from 'react-router-dom';

const DEFAULT_COLOR = '#1677ff';

const TagForm = (props) => {
    const translate = useTranslate();
    const { kind } = useParams();

    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, groups, branchs, isEditing } = props;

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const { execute: executeGetTagList } = useFetch(apiConfig.tag.getList);

    const handleSubmit = async (values) => {
        const exists = await isTagNameExists(values.name);
        if (exists) {
            form.setFields([
                {
                    name: 'name',
                    errors: [translate.formatMessage(commonMessage.tagNameExists)],
                },
            ]);
            return;
        }
        const colorValue = values.color?.toHexString ? values.color.toHexString() : values.color;
        return mixinFuncs.handleSubmit({ ...values, color: colorValue });
    };

    const isTagNameExists = async (name) => {
        return new Promise((resolve, reject) => {
            executeGetTagList({
                params: { kind: Number(kind) },
                onCompleted: (response) => {
                    if (response.result === true) {
                        const list = response?.data?.content || [];
                        const exists = list.some((item) => item.name === name && item.id !== dataDetail?.id);
                        resolve(exists);
                    } else {
                        resolve(false);
                    }
                },
                onError: (error) => {
                    console.log(error);
                    reject(error);
                },
            });
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            name: dataDetail?.name,
            color: dataDetail?.color || DEFAULT_COLOR,
        });
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.tagName)}
                            type="text"
                            name="name"
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <ColorPickerFieldV1
                            label={translate.formatMessage(commonMessage.color)}
                            name="color"
                            color={dataDetail?.color}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};
export default TagForm;
