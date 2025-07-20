import React, { useEffect } from 'react';
import { Modal, Button } from 'antd';
import useTranslate from '@hooks/useTranslate';
import ContactsForm from '@modules/contacts/ContactsForm';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { GROUP_KIND_ADMIN, STATUS_ACTIVE } from '@constants';
import useSaveBase from '@hooks/useSaveBase';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';

const ContactsCreateModal = ({ visible, onClose, onSubmit, pageOptions, phoneNumber }) => {
    const translate = useTranslate();


    const { data } = useFetch(apiConfig.groupPermission.getGroupList, {
        immediate: true,
        mappingData: (res) =>
            res.data?.content?.map((item) => ({ value: item.id, label: item.name })),
        params: {
            kind: GROUP_KIND_ADMIN,
        },
    });

    const {
        mixinFuncs,
        loading,
        onSave,
        setIsChangedFormValues,
        isEditing,
    } = useSaveBase({
        apiConfig: {
            create: apiConfig.contacts.create,
        },
        options: {
            getListUrl: pageOptions.listPageUrl,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareCreateData = (data) => ({
                ...data,
                avatarPath: data.avatar,
                status: STATUS_ACTIVE,
            });
            funcs.mappingData = (data) => ({
                ...data.data,
            });
            funcs.renderActions = () => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button 
                        onClick={() => funcs.onBack()} 
                        danger 
                        icon={<CloseCircleOutlined />}
                    >
                        {translate.formatMessage({
                            id: 'contacts.cancel',
                            defaultMessage: 'Cancel',
                        })}
                    </Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        icon={<SaveOutlined />} 
                    >
                        {translate.formatMessage({
                            id: 'contacts.create',
                            defaultMessage: 'Create',
                        })}
                    </Button>
                </div>
            );
            funcs.onBack = () => {
                onClose();
                window.location.reload();
            };
            funcs.getDetail = () => {};
        },
    });

    useEffect(() => {
        if (mixinFuncs && isEditing) {
            mixinFuncs.setEditing(false);
        }
    }, [mixinFuncs, isEditing]);

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            title={translate.formatMessage({
                id: 'contacts.create',
                defaultMessage: 'Create Contact',
            })}
            width={850}
            style={{ top: 20, maxWidth: 'none' }}
            bodyStyle={{ height: 600, overflowY: 'auto' }}
            destroyOnClose
        >
            <ContactsForm
                setIsChangedFormValues={setIsChangedFormValues}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                groups={data || []}
                initialValues={{ phone: phoneNumber }} 
            />
        </Modal>
    );
};

export default ContactsCreateModal;
