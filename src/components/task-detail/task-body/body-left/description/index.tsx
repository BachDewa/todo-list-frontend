import classNames from 'classnames';
import {FC, useState} from 'react';
import {useForm} from 'react-hook-form';

import useTask from '@/components/task-detail/hooks/use-task';
import Button from '@/core-ui/button';
import Icon from '@/core-ui/icon';
import {IBaseProps} from '@/types';

import Title from '../../title';
import DescriptionButton from './description-button';
import DescriptionForm, {IDescriptionForm} from './description-form';

const Description: FC<IBaseProps> = ({className}) => {
  const {write} = useTask();
  const form = useForm<IDescriptionForm>({mode: 'onChange', defaultValues: {description: ''}});
  const [isEditing, setIsEditing] = useState(false);

  const onClick = () => {
    if (write) setIsEditing(true);
  };
  const onClose = () => {
    if (write) setIsEditing(false);
  };

  const editBtn = !isEditing && write && <Button text="Edit" className="edit-btn" onClick={onClick} />;

  return (
    <div className={classNames('description', className)}>
      <Title icon={<Icon name="ico-description" />} text="Description" rightBtn={editBtn} />
      {!isEditing ? <DescriptionButton {...{onClick}} /> : <DescriptionForm {...{form, onClose}} />}
    </div>
  );
};

export default Description;