import React, { useEffect, useState } from 'react';
import { Card, Col, Empty, Row } from 'antd';

import { emailValidator, phoneValidator } from '@utils/formValidator';
import { AppConstants, DISTRICT_KIND, PROVINCE_KIND, VILLAGE_KIND } from '@constants';
import apiConfig from '@constants/apiConfig';
import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import CropImageField from '@components/common/form/CropImageField';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import SelectField from '@components/common/form/SelectField';
import { showErrorMessage } from '@services/notifyService';

const ContactsForm = (props) => {
    const translate = useTranslate();

    const initialValuesFromProps = props.initialValues || {};
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);
    const [provinceId, setProvinceId] = useState(null);
    const [districtId, setDistrictId] = useState(null);
    const { execute: executeFetchNation } = useFetch(apiConfig.nation.autoComplete);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const { data: provinces } = useFetch(apiConfig.nation.autoComplete, {
        immediate: true,
        params: { page: 0, size: 63, kind: PROVINCE_KIND },
        mappingData: (res) => res?.data?.content.map((item) => ({ value: item.id, label: item.name })) || [],
    });

    const fetchDistricts = (provinceId) => {
        executeFetchNation({
            params: { kind: DISTRICT_KIND, parentId: provinceId },
            onCompleted: (response) => {
                if (response.result) {
                    setDistricts(response.data.content.map((item) => ({ value: item.id, label: item.name })));
                    setIsChangedFormValues(true);
                } else {
                    setDistricts([]);
                }
            },
        });
    };

    const fetchCommunes = (districtId) => {
        executeFetchNation({
            params: { kind: VILLAGE_KIND, parentId: districtId },
            onCompleted: (response) => {
                if (response.result && response.data?.content) {
                    setCommunes(response.data.content.map((item) => ({ value: item.id, label: item.name })));
                    setIsChangedFormValues(true);
                } else {
                    setCommunes([]);
                }
            },
        });
    };

    const handleProvinceChange = (value) => {
        setProvinceId(value);
        setDistrictId(null);
        setDistricts([]);
        setCommunes([]);
        form.setFieldsValue({ districtId: null, communeId: null });

        if (value) {
            fetchDistricts(value);
        }
    };

    const handleDistrictChange = (value) => {
        setDistrictId(value);
        setCommunes([]);
        form.setFieldsValue({ communeId: null });

        if (value) {
            fetchCommunes(value);
        }
    };

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: { type: 'AVATAR', file },
            onCompleted: (response) => {
                if (response.result) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError,
        });
    };

    const { data: contacts } = useFetch(apiConfig.contacts.getList, {
        immediate: true,
        mappingData: (res) => res?.data?.content || [],
    });

    const handleSubmit = (values) => {
        let hasError = false;

        const emailConflict = contacts?.find((item) => item.email === values.email && item.id !== dataDetail?.id);
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

        const phoneConflict = contacts?.find((item) => item.phone === values.phone && item.id !== dataDetail?.id);
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

        const defaultValues = {
            name: dataDetail?.name || '',
            phone: initialValuesFromProps?.phone || dataDetail?.phone || '',
            email: dataDetail?.email || '',
            address: dataDetail?.address || '',
            provinceId: dataDetail?.province?.id || '',
            districtId: dataDetail?.district?.id || '',
            communeId: dataDetail?.commune?.id || '',
        };

        form.setFieldsValue(defaultValues);
        setImageUrl(dataDetail?.avatar);

        if (dataDetail?.province?.id && dataDetail?.province?.id !== provinceId) {
            setProvinceId(dataDetail.province.id);
            fetchDistricts(dataDetail.province.id);
        }

        if (dataDetail?.district?.id && dataDetail?.district?.id !== districtId) {
            setDistrictId(dataDetail.district.id);
            fetchCommunes(dataDetail.district.id);
        }
    }, [dataDetail?.id]);

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
                        <TextField label={translate.formatMessage(commonMessage.fullName)} required name="name" />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.phone)}
                            type="number"
                            name="phone"
                            required
                            rules={[
                                {
                                    validator: (_, value) => phoneValidator(_, value, translate),
                                },
                            ]}
                            disabled={!!initialValuesFromProps?.phone}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.email)}
                            name="email"
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            rules={[
                                {
                                    validator: (_, value) => emailValidator(_, value, translate),
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.address)}
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            name="address"
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.province)}
                            name="provinceId"
                            options={provinces}
                            onChange={handleProvinceChange}
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            notFoundContent={<Empty description={translate.formatMessage(commonMessage.noData)} />}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.district)}
                            name="districtId"
                            options={districts}
                            onChange={handleDistrictChange}
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            notFoundContent={<Empty description={translate.formatMessage(commonMessage.noData)} />}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.village)}
                            name="communeId"
                            options={communes}
                            required
                            requiredMsg={translate.formatMessage(commonMessage.required)}
                            notFoundContent={<Empty description={translate.formatMessage(commonMessage.noData)} />}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ContactsForm;
