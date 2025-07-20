import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';

import { BaseForm } from '@components/common/form/BaseForm';
import CropImageField from '@components/common/form/CropImageField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';

import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';

import {
    confirmPasswordValidator,
    emailValidator,
    oldPasswordValidator,
    passwordValidator,
    passwordValidatorWithOldPassword,
    phoneValidator,
} from '@utils/formValidator';

import { AppConstants, GROUP_KIND_EMPLOYEE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { employeeStatusOptions, genderOptions } from '@constants/masterData';

import { commonMessage } from '@locales/intl';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { showErrorMessage } from '@services/notifyService';

const EmployeeForm = (props) => {
    const translate = useTranslate();
    const genderValues = translate.formatKeys(genderOptions, ['label']);
    const statusValues = translate.formatKeys(employeeStatusOptions, ['label']);
    const [group, setGroup] = useState(null);

    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, groups, branchs, isEditing } = props;

    const { execute: executeGetGroupId } = useFetch(apiConfig.groupPermission.getList, {
        immediate: false,
    });

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

    useEffect(() => {
        executeGetGroupId({
            params: {
                kind: GROUP_KIND_EMPLOYEE,
            },
            onCompleted: (response) => setGroup(response?.data?.content),
        });
    }, []);

    const { data: employees } = useFetch(apiConfig.employee.getList, {
        immediate: true,
        mappingData: (res) => res.data?.content || [],
    });

    const handleSubmit = (values) => {
        if (values.oldPassword && values.password && !values.confirmPassword) {
            return form.setFields([
                {
                    name: 'confirmPassword',
                    errors: [translate.formatMessage(commonMessage.required)],
                },
            ]);
        }

        let hasError = false;

        if (!isEditing) {
            const userByUsername = employees?.find((item) => item.account.username === values.username);
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

        const emailConflict = employees?.find(
            (item) => item.account.email === values.email && item.id !== dataDetail?.id,
        );
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

        const phoneConflict = employees?.find(
            (item) => item.account.phone === values.phone && item.id !== dataDetail?.id,
        );
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

        return mixinFuncs.handleSubmit({ ...values, avatarPath: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            email: dataDetail?.account?.email,
            fullName: dataDetail?.account?.fullName,
            gender: dataDetail?.gender,
            phone: dataDetail?.account?.phone,
            username: dataDetail?.account?.username,
            groupId: dataDetail?.account?.group?.id,
            status: dataDetail?.account?.status,
            departmentId: dataDetail?.department?.id,
        });
        setImageUrl(dataDetail?.account?.avatar);
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.avatar)}
                            name="avatarPath"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.email)}
                            required
                            name="email"
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            rules={[
                                {
                                    validator: (_, value) => emailValidator(_, value, translate),
                                },
                            ]}
                            placeholder="example@gmail.com"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.fullName)}
                            required
                            name="fullName"
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.gender)}
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            name="gender"
                            allowClear={false}
                            options={genderValues}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.phone)}
                            name="phone"
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

                {isEditing ? (
                    <>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.username)}
                                    required
                                    disabled={isEditing}
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    name="username"
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.oldPassword)}
                                    required={!isEditing}
                                    name="oldPassword"
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    type="password"
                                    rules={[
                                        {
                                            validator: (_, value) => oldPasswordValidator(_, value, form, translate),
                                        },
                                    ]}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.password)}
                                    required={!isEditing}
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    name="password"
                                    type="password"
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                passwordValidatorWithOldPassword(_, value, form, translate),
                                        },
                                    ]}
                                />
                            </Col>

                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.confirmPassword)}
                                    required={!isEditing}
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    name="confirmPassword"
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
                                    label={translate.formatMessage(commonMessage.permission)}
                                    name="groupId"
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    options={
                                        group ? [...group].map((item) => ({ value: item.id, label: item.name })) : []
                                    }
                                    required
                                    allowClear={false}
                                    optionLabelProp="label"
                                />
                            </Col>
                            <Col span={12}>
                                <AutoCompleteField
                                    label={translate.formatMessage(commonMessage.department)}
                                    name="departmentId"
                                    apiConfig={apiConfig.department.autocomplete}
                                    mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                    required
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <SelectField
                                    options={statusValues}
                                    name="status"
                                    required={translate.formatMessage(commonMessage.required)}
                                    label={translate.formatMessage(commonMessage.status)}
                                    allowClear={false}
                                />
                            </Col>
                        </Row>
                    </>
                ) : (
                    <>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.username)}
                                    required
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    name="username"
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.password)}
                                    name="password"
                                    type="password"
                                    required
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    rules={[
                                        {
                                            validator: () => passwordValidator(form, translate),
                                        },
                                    ]}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.confirmPassword)}
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    rules={[
                                        {
                                            validator: () => confirmPasswordValidator(form, translate),
                                        },
                                    ]}
                                />
                            </Col>

                            <Col span={12}>
                                <SelectField
                                    label={translate.formatMessage(commonMessage.permission)}
                                    name="groupId"
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    options={
                                        group ? [...group].map((item) => ({ value: item.id, label: item.name })) : []
                                    }
                                    required
                                    allowClear={false}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <AutoCompleteField
                                    label={translate.formatMessage(commonMessage.department)}
                                    name="departmentId"
                                    apiConfig={apiConfig.department.autocomplete}
                                    mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                    required
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                />
                            </Col>
                            <Col span={12}>
                                <SelectField
                                    options={statusValues}
                                    name="status"
                                    required
                                    requiredMsg={translate.formatMessage(commonMessage.required)}
                                    label={translate.formatMessage(commonMessage.status)}
                                    allowClear={false}
                                />
                            </Col>
                        </Row>
                    </>
                )}
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};
export default EmployeeForm;
