import React, {useEffect, useRef, useState} from 'react';
import type {OnyxEntry} from 'react-native-onyx';
import {withOnyx} from 'react-native-onyx';
import {WebView} from 'react-native-webview';
import AccountingConnectionConfirmationModal from '@components/AccountingConnectionConfirmationModal';
import FullPageOfflineBlockingView from '@components/BlockingViews/FullPageOfflineBlockingView';
import FullScreenLoadingIndicator from '@components/FullscreenLoadingIndicator';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import Modal from '@components/Modal';
import useLocalize from '@hooks/useLocalize';
import {removePolicyConnection} from '@libs/actions/connections';
import getQuickBooksOnlineSetupLink from '@libs/actions/connections/QuickBooksOnline';
import * as PolicyAction from '@userActions/Policy/Policy';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type {Session} from '@src/types/onyx';
import type {ConnectToQuickbooksOnlineFlowProps} from './types';

type ConnectToQuickbooksOnlineFlowOnyxProps = {
    /** Session info for the currently logged in user. */
    session: OnyxEntry<Session>;
};

const renderLoading = () => <FullScreenLoadingIndicator />;

function ConnectToQuickbooksOnlineFlow({
    policyID,
    session,
    shouldDisconnectIntegrationBeforeConnecting,
    integrationToDisconnect,
}: ConnectToQuickbooksOnlineFlowProps & ConnectToQuickbooksOnlineFlowOnyxProps) {
    const {translate} = useLocalize();
    const webViewRef = useRef<WebView>(null);
    const [isWebViewOpen, setWebViewOpen] = useState(false);

    const authToken = session?.authToken ?? null;

    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

    useEffect(() => {
        if (shouldDisconnectIntegrationBeforeConnecting && integrationToDisconnect) {
            setIsDisconnectModalOpen(true);
            return;
        }
        // Since QBO doesn't support Taxes, we should disable them from the LHN when connecting to QBO
        PolicyAction.enablePolicyTaxes(policyID, false);
        setWebViewOpen(true);
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {shouldDisconnectIntegrationBeforeConnecting && integrationToDisconnect && isDisconnectModalOpen && (
                <AccountingConnectionConfirmationModal
                    onConfirm={() => {
                        // Since QBO doesn't support Taxes, we should disable them from the LHN when connecting to QBO
                        PolicyAction.enablePolicyTaxes(policyID, false);
                        removePolicyConnection(policyID, integrationToDisconnect);
                        setIsDisconnectModalOpen(false);
                        setWebViewOpen(true);
                    }}
                    integrationToConnect={CONST.POLICY.CONNECTIONS.NAME.QBO}
                    onCancel={() => setIsDisconnectModalOpen(false)}
                />
            )}
            {isWebViewOpen && (
                <Modal
                    onClose={() => setWebViewOpen(false)}
                    fullscreen
                    isVisible
                    type={CONST.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE}
                >
                    <HeaderWithBackButton
                        title={translate('workspace.accounting.title')}
                        onBackButtonPress={() => setWebViewOpen(false)}
                    />
                    <FullPageOfflineBlockingView>
                        <WebView
                            ref={webViewRef}
                            source={{
                                uri: getQuickBooksOnlineSetupLink(policyID),
                                headers: {
                                    Cookie: `authToken=${authToken}`,
                                },
                            }}
                            incognito // 'incognito' prop required for Android, issue here https://github.com/react-native-webview/react-native-webview/issues/1352
                            startInLoadingState
                            renderLoading={renderLoading}
                        />
                    </FullPageOfflineBlockingView>
                </Modal>
            )}
        </>
    );
}

ConnectToQuickbooksOnlineFlow.displayName = 'ConnectToQuickbooksOnlineFlow';

export default withOnyx<ConnectToQuickbooksOnlineFlowProps & ConnectToQuickbooksOnlineFlowOnyxProps, ConnectToQuickbooksOnlineFlowOnyxProps>({
    session: {
        key: ONYXKEYS.SESSION,
    },
})(ConnectToQuickbooksOnlineFlow);
