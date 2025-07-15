import { useCallback } from 'react';

import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';

const useDeviceList = () => {
    const { data, queryFilter, loading, pagination, mixinFuncs } = useListBase({
        apiConfig: {
            getList: apiConfig.device.getListForClient,
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data,
                        total: response.data.length,
                    };
                }
                return { data: [], total: 0 };
            };
        },
    });

    const checkDuplicate = useCallback((serial, simNumber) => {
        if (!data || data.length === 0) return false;
        return data.some(item => item.serial === serial || item.simNumber === simNumber);
    }, [data]);

    return { data, queryFilter, loading, pagination, mixinFuncs, checkDuplicate };
};

export default useDeviceList;
