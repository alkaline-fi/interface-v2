import { Connector } from '@web3-react/types';
import {
  Connection,
  gnosisSafeConnection,
  networkConnection,
} from 'connectors/index';
import { useGetConnection } from 'hooks';
import { useEffect } from 'react';
import { useSelectedWallet } from 'state/user/hooks';

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly();
    } else {
      await connector.activate();
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`);
  }
}

export default function useEagerlyConnect() {
  const { selectedWallet, updateSelectedWallet } = useSelectedWallet();
  const getConnection = useGetConnection();

  let selectedConnection: Connection | undefined;
  if (selectedWallet) {
    try {
      selectedConnection = getConnection(selectedWallet);
    } catch {
      updateSelectedWallet(undefined);
    }
  }

  useEffect(() => {
    connect(gnosisSafeConnection.connector);
    connect(networkConnection.connector);

    if (selectedConnection) {
      connect(selectedConnection.connector);
    } // The dependency list is empty so this is only run once on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
