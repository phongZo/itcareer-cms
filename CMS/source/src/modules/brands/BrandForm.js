import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Input } from 'antd';

import { BaseForm } from '@components/common/form/BaseForm';
import CropImageField from '@components/common/form/CropImageField';
import TextField from '@components/common/form/TextField';

import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';

import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';

import { commonMessage } from '@locales/intl';
import useListBase from '@hooks/useListBase';
import { checkDuplicateValue } from '@utils/formValidator';

const { TextArea } = Input;

const BrandForm = (props) => {
    const translate = useTranslate();

    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const list = useListBase({
        apiConfig: {
            getList: apiConfig.device.getListForClient,
        },
    }).data;

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response?.result === true && response?.data?.filePath) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            categoryId: dataDetail?.id || 0,
            description: values.description || "",
            image: imageUrl || "",
            kind: dataDetail?.kind ?? 2,
            name: values.name,
            ordering: dataDetail?.ordering ?? 0,
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            name: dataDetail?.name,
            description: dataDetail?.description,
        });
        setImageUrl(dataDetail?.image);
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.image)}
                            name="image"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        {/* <TextField label={translate.formatMessage(commonMessage.Name)} required name="name" /> */}
                        <TextField
                            label={translate.formatMessage(commonMessage.Name)}
                            name="name"
                            required
                            //requiredMsg={translate.formatMessage(commonMessage.required)}
                            // rules={[
                            //     {
                            //         validator: (rule, value) => 
                            //             checkDuplicateValue(
                            //                 value,
                            //                 list,
                            //                 "name",
                            //                 null, 
                            //                 "Device",
                            //                 translate,
                            //                 commonMessage.duplicate,
                            //             ),
                            //     },
                            // ]}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField label={translate.formatMessage(commonMessage.description)} name="description" type="textarea" rows={6} />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default BrandForm;
