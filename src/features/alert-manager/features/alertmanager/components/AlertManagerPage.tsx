import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { ContentVariants } from '@patternfly/react-core/dist/esm/components/Content/Content';
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import OpenDrawerRightIcon from '@patternfly/react-icons/dist/js/icons/open-drawer-right-icon';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
// eslint-disable-next-line no-restricted-imports -- Page component needs chrome for document title
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import AlertManagerTable from './AlertManagerTable';
import messages from '../messages';
import './AlertManagerPage.scss';

const AlertManagerPage: React.FC = () => {
  const intl = useIntl();
  const { updateDocumentTitle, helpTopics } = useChrome();

  useEffect(() => {
    updateDocumentTitle?.(intl.formatMessage(messages.pageTitle));
  }, [updateDocumentTitle, intl]);

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    helpTopics?.setActiveTopic?.('learn');
  };

  return (
    <>
      <PageHeader>
        <div className="alert-manager-header">
          <Flex>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
              <div className="iconMinWidth-1-2-2">
                <img
                  src="/apps/frontend-assets/technology-icons/notifications.svg"
                  alt=""
                />
              </div>
            </FlexItem>
            <Divider orientation={{ default: 'vertical' }} />
            <FlexItem flex={{ default: 'flex_1' }}>
              <Title headingLevel="h1" size="2xl" className="pf-v6-u-mb-sm">
                {intl.formatMessage(messages.pageTitle)}
              </Title>
              <Content component={ContentVariants.p}>
                {intl.formatMessage(messages.pageDescription)}
              </Content>
              <Content component={ContentVariants.p}>
                <a
                  href="#"
                  onClick={handleLearnMore}
                  className="alert-manager-learn-more"
                >
                  {intl.formatMessage(messages.learnMore)}{' '}
                  <OpenDrawerRightIcon />
                </a>
              </Content>
            </FlexItem>
          </Flex>
        </div>
      </PageHeader>
      <Divider />
      <Main>
        <AlertManagerTable />
      </Main>
    </>
  );
};

export default AlertManagerPage;
