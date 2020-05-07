import React from 'react';
import nanoid from 'nanoid';
import { formatClientCell } from '../../../helpers/formatClientCell';
import getHintElement from './getHintElement';
import CustomTooltip from '../Tooltip/CustomTooltip';
import { checkFiltered } from '../../../helpers/helpers';
import { BLOCK_ACTIONS } from '../../../helpers/constants';

const getClientCell = (row, t, isDetailed, toggleBlocking, autoClients) => {
    const {
        upstream, reason, client, domain, info: { name },
    } = row.original;

    const autoClient = autoClients.find(autoClient => autoClient.name === client);

    const id = nanoid();

    const data = {
        table_name: domain,
        ip: client,
        dhcp_table_hostname: upstream,
        country: autoClient && autoClient.country,
        network: autoClient && autoClient.orgname,
    };

    const processedData = Object.entries(data)
        .filter(([, value]) => Boolean(value));

    const isFiltered = checkFiltered(reason);
    const buttonType = isFiltered ? BLOCK_ACTIONS.unblock : BLOCK_ACTIONS.block;

    const optionsToHandlerMap = {
        [`${buttonType}_btn`]: () => toggleBlocking(buttonType, domain),
    };

    const options = Object.entries(optionsToHandlerMap)
        .map(([option, handler]) => <div key={option} onClick={handler}>{t(option)}</div>);

    return (
        <div className="logs__row o-hidden justify-content-between h-100">
            <div className="w-90 o-hidden">
                <div data-tip={true} data-for={id}>{formatClientCell(row, t, isDetailed)}</div>
                {isDetailed && <div className="detailed-info d-none d-sm-block logs__text">{name}</div>}
            </div>
            {processedData.length > 0 &&
            <CustomTooltip id={id} place='bottom' title="client_details"
                           contentItemClass='key-colon'
                           content={processedData} />}
            {getHintElement({
                className: `icons menu--dots icon--small ${isDetailed ? 'my-3' : ''}`,
                dataTip: true,
                xlinkHref: 'options_dots',
                contentItemClass: 'tooltip__option py-3 px-5 key-colon',
                columnClass: 'h-100 grid__one-row',
                content: options,
                place: 'bottom',
                tooltipClass: 'px-0 py-3',
            })}
        </div>
    );
};

export default getClientCell;
