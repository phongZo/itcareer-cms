import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import { confirmPasswordValidator, emailValidator, passwordValidator, phoneValidator } from '@utils/formValidator';

import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import { showErrorMessage } from '@services/notifyService';

const AdminForm = (props) => {
    const translate = useTranslate();

    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, groups, branchs, isEditing } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
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

    const { data: admins } = useFetch(apiConfig.account.getList, {
        immediate: true,
        mappingData: (res) => res?.data || [],
    });

    const handleSubmit = (values) => {
        let hasError = false;

        if (!isEditing) {
            const userByUsername = admins?.find((item) => item.username === values.username);
            if (userByUsername) {
                form.setFields([
                    {
                        name: 'username',
                        errors: [translate.formatMessage(commonMessage.usernameExisted)],
                    },
                ]);
                hasError = true;
            } else {
                form.setFields([{ name: 'username', errors: [] }]);
            }
        }

        const emailConflict = admins?.find((item) => item.email === values.email && item.id !== dataDetail?.id);
        if (emailConflict) {
            form.setFields([
                {
                    name: 'email',
                    errors: [translate.formatMessage(commonMessage.emailExisted)],
                },
            ]);
            hasError = true;
        } else {
            form.setFields([{ name: 'email', errors: [] }]);
        }

        const phoneConflict = admins?.find((item) => item.phone === values.phone && item.id !== dataDetail?.id);
        if (phoneConflict) {
            form.setFields([
                {
                    name: 'phone',
                    errors: [translate.formatMessage(commonMessage.phoneExisted)],
                },
            ]);
            hasError = true;
        } else {
            form.setFields([{ name: 'phone', errors: [] }]);
        }

        if (hasError) {
            showErrorMessage('Thông tin đã tồn tại!', translate);
            return;
        }

        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            username: dataDetail?.username,
            fullName: dataDetail?.fullName,
            email: dataDetail?.email,
            phone: dataDetail?.phone,
            groupId: dataDetail?.group?.id,
            password: dataDetail?.password,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.avatar)}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            disabled={isEditing}
                            label={translate.formatMessage(commonMessage.username)}
                            name="username"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            label={translate.formatMessage(commonMessage.fullName)}
                            required
                            name="fullName"
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            label={translate.formatMessage(commonMessage.email)}
                            name="email"
                            type="email"
                            required
                            rules={[
                                {
                                    validator: (_, value) => emailValidator(_, value, translate),
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.phone)}
                            name="phone"
                            type="phone"
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            required
                            minLength="10"
                            maxLength="10"
                            rules={[
                                {
                                    validator: (_, value) => phoneValidator(_, value, translate),
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.password)}
                            name="password"
                            type="password"
                            required={!isEditing}
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            rules={[
                                {
                                    validator: () => passwordValidator(form, translate),
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.confirmPassword)}
                            required={!isEditing}
                            name="confirmPassword"
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            type="password"
                            rules={[
                                {
                                    validator: () => confirmPasswordValidator(form, translate),
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            required
                            name="groupId"
                            label={translate.formatMessage(commonMessage.groupPermission)}
                            allowClear={false}
                            options={groups}
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default AdminForm;
