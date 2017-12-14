import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { AttributeBorder } from './AttributeBorder';
import { AttributesRemovePermanent } from './AttributesRemovePermanent';
import { PermanentPoints } from './PermanentPoints';

export interface AttributesPermanentListItemProps {
	locale: UIMessages;
	id: 'LP' | 'AE' | 'KP';
	label: string;
	name: string;
	boughtBack?: number;
	lost: number;
	isRemovingEnabled: boolean;
	getEditPermanentEnergy: 'LP' | 'AE' | 'KP' | undefined;
	getAddPermanentEnergy: 'LP' | 'AE' | 'KP' | undefined;
	addBoughtBackPoint?(): void;
	addLostPoint(): void;
	addLostPoints(value: number): void;
	removeBoughtBackPoint?(): void;
	removeLostPoint(): void;
	openAddPermanentEnergyLoss(energy: 'LP' | 'AE' | 'KP'): void;
	closeAddPermanentEnergyLoss(): void;
	openEditPermanentEnergy(energy: 'LP' | 'AE' | 'KP'): void;
	closeEditPermanentEnergy(): void;
}

export class AttributesPermanentListItem extends React.Component<AttributesPermanentListItemProps> {
	openEditPermanentEnergy = () => this.props.openEditPermanentEnergy(this.props.id);
	openAddPermanentEnergyLoss = () => this.props.openAddPermanentEnergyLoss(this.props.id);

	render() {
		const { id, label, locale, name, isRemovingEnabled, addBoughtBackPoint, addLostPoints, boughtBack, lost, getEditPermanentEnergy, getAddPermanentEnergy, closeAddPermanentEnergyLoss, closeEditPermanentEnergy } = this.props;
		const available = typeof boughtBack === 'number' ? lost - boughtBack : lost;

		return (
			<AttributeBorder
				label={label}
				value={available}
				tooltip={<div className="calc-attr-overlay">
					<h4><span>{name}</span><span>{available}</span></h4>
					{typeof boughtBack === 'number' ? <p>
						{_translate(locale, 'attributes.tooltips.losttotal')}: {lost}<br/>
						{_translate(locale, 'attributes.tooltips.boughtback')}: {boughtBack}
					</p> : <p>
						{_translate(locale, 'attributes.tooltips.losttotal')}: {lost}
					</p>}
				</div>}
				tooltipMargin={7}
				>
				{isRemovingEnabled && (
					<IconButton
						className="edit"
						icon="&#xE90c;"
						onClick={this.openEditPermanentEnergy}
						/>
				)}
				<PermanentPoints
					{...this.props}
					isOpened={getEditPermanentEnergy === id}
					close={closeEditPermanentEnergy}
					permanentBoughtBack={boughtBack}
					permanentSpent={lost}
					/>
				{!isRemovingEnabled && (
					<IconButton
						className="add"
						icon="&#xE908;"
						onClick={this.openAddPermanentEnergyLoss}
						/>
				)}
				<AttributesRemovePermanent
					remove={addLostPoints}
					locale={locale}
					isOpened={getAddPermanentEnergy === id}
					close={closeAddPermanentEnergyLoss}
					/>
				{!isRemovingEnabled && addBoughtBackPoint && (
					<IconButton
						className="remove"
						icon="&#xE909;"
						onClick={addBoughtBackPoint}
						disabled={available <= 0}
						/>
				)}
			</AttributeBorder>
		);
	}
}
