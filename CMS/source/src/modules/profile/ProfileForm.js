import TextField from '@components/common/form/TextField';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { Card, Form } from 'antd';

const messages = defineMessages({
    banner: 'Banner',
    avatarPath: 'Avatar',
    username: 'Username',
    career: 'Career Name',
    fullName: 'Leader',
    email: 'Email',
    hotline: 'Hot line',
    phoneNumber: 'Phone Number',
    taxNumber: 'Tax Number',
    zipCode: 'Zip Code',
    city: 'City',
    address: 'Address',
    logo: 'Logo',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    passwordLengthError: 'Password must be at least 6 characters',
    passwordMatchError: 'Password does not match',
});

const ProfileForm = (props) => {
    const { formId, dataDetail, onSubmit, setIsChangedFormValues, actions, isAdmin } = props;

    const translate = useTranslate();

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    const handleFinish = (values) => {
        mixinFuncs.handleSubmit({
            ...values,
            fullName: values.fullName,
            oldPassword: values.oldPassword,
            password: values.password,
        });
    };

    return (
        <Card className="card-form" bordered={false} style={{ minHeight: 'calc(100vh - 190px)' }}>
            <Form
                style={{ width: '80%' }}
                labelCol={{ span: 8 }}
                id={formId}
                onFinish={handleFinish}
                form={form}
                layout="horizontal"
                onValuesChange={onValuesChange}
            >
                <TextField
                    readOnly
                    label={translate.formatMessage(messages.username)}
                    name={'username'}
                />
                <TextField label={translate.formatMessage(messages.email)} name={'email'} />
                <TextField label={translate.formatMessage(messages.fullName)} name={'fullName'} />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.currentPassword)}
                    required
                    name="oldPassword"
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.newPassword)}
                    name="password"
                    rules={[
                        {
                            validator: async () => {
                                const isTouched = form.isFieldTouched('newPassword');
                                if (isTouched) {
                                    const value = form.getFieldValue('newPassword');
                                    if (value.length < 6) {
                                        throw new Error(translate.formatMessage(messages.passwordLengthError));
                                    }
                                }
                            },
                        },
                    ]}
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.confirmPassword)}
                    rules={[
                        {
                            validator: async () => {
                                const password = form.getFieldValue('newPassword');
                                const confirmPassword = form.getFieldValue('confirmPassword');
                                if (password !== confirmPassword) {
                                    throw new Error(translate.formatMessage(messages.passwordMatchError));
                                }
                            },
                        },
                    ]}
                />

                <div className="footer-card-form">{actions}</div>
            </Form>
        </Card>
    );
};

export default ProfileForm;
