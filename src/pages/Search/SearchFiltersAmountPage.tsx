import React from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import AmountWithoutCurrencyForm from '@components/AmountWithoutCurrencyForm';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormOnyxValues} from '@components/Form/types';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import useAutoFocusInput from '@hooks/useAutoFocusInput';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import {updateAdvancedFilters} from '@libs/actions/Search';
import Navigation from '@libs/Navigation/Navigation';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import INPUT_IDS from '@src/types/form/SearchAdvancedFiltersForm';

function SearchFiltersAmountPage() {
    const styles = useThemeStyles();
    const {translate} = useLocalize();

    const [searchAdvancedFiltersForm] = useOnyx(ONYXKEYS.FORMS.SEARCH_ADVANCED_FILTERS_FORM);
    const greaterThan = searchAdvancedFiltersForm?.[INPUT_IDS.GREATER_THAN];
    const lessThan = searchAdvancedFiltersForm?.[INPUT_IDS.LESS_THAN];
    const {inputCallbackRef} = useAutoFocusInput();

    const updateAmountFilter = (values: FormOnyxValues<typeof ONYXKEYS.FORMS.SEARCH_ADVANCED_FILTERS_FORM>) => {
        updateAdvancedFilters(values);
        Navigation.goBack(ROUTES.SEARCH_ADVANCED_FILTERS);
    };

    return (
        <ScreenWrapper
            testID={SearchFiltersAmountPage.displayName}
            shouldShowOfflineIndicatorInWideScreen
            offlineIndicatorStyle={styles.mtAuto}
            includeSafeAreaPaddingBottom={false}
        >
            <HeaderWithBackButton
                title={translate('common.total')}
                onBackButtonPress={() => {
                    Navigation.goBack(ROUTES.SEARCH_ADVANCED_FILTERS);
                }}
            />
            <FormProvider
                style={[styles.flex1, styles.ph5]}
                formID={ONYXKEYS.FORMS.SEARCH_ADVANCED_FILTERS_FORM}
                onSubmit={updateAmountFilter}
                submitButtonText={translate('common.save')}
                enabledWhenOffline
            >
                <View style={styles.mb5}>
                    <InputWrapper
                        InputComponent={AmountWithoutCurrencyForm}
                        inputID={INPUT_IDS.GREATER_THAN}
                        name={INPUT_IDS.GREATER_THAN}
                        defaultValue={greaterThan}
                        label={translate('search.filters.amount.greaterThan')}
                        accessibilityLabel={translate('search.filters.amount.greaterThan')}
                        role={CONST.ROLE.PRESENTATION}
                    />
                </View>
                <View style={styles.mb5}>
                    <InputWrapper
                        InputComponent={AmountWithoutCurrencyForm}
                        inputID={INPUT_IDS.LESS_THAN}
                        name={INPUT_IDS.LESS_THAN}
                        defaultValue={lessThan}
                        label={translate('search.filters.amount.lessThan')}
                        accessibilityLabel={translate('search.filters.amount.lessThan')}
                        role={CONST.ROLE.PRESENTATION}
                        ref={inputCallbackRef}
                    />
                </View>
            </FormProvider>
        </ScreenWrapper>
    );
}

SearchFiltersAmountPage.displayName = 'SearchFiltersAmountPage';

export default SearchFiltersAmountPage;
