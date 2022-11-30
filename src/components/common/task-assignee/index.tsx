import {Autocomplete, Box, TextField} from '@mui/material';
import {FC, SyntheticEvent, useState} from 'react';

import AssigneeIcon from '@/components/common/assignee-icon';
import api from '@/data/api';
import {ITaskResponse} from '@/data/api/types/task.type';
import {IMember} from '@/data/api/types/todolist.type';
import useMemberOptions from '@/hooks/useMemberOptions';
import {useStateAuth} from '@/states/auth';

import style from './style.module.scss';

interface ITaskAssigneeProps {
  task: ITaskResponse;
  onSuccess?: () => void;
  assigneeList?: IMember[];
}

const TaskAssignee: FC<ITaskAssigneeProps> = ({task, assigneeList = [], onSuccess}) => {
  const auth = useStateAuth();
  const {id, assignees} = task;
  const assigneeId = assignees.filter(e => e.isActive)[0]?.userId;

  const {options, optionActive} = useMemberOptions(assigneeList, assigneeId);

  const [isEdting, setEditing] = useState(false);

  const onClick = () => setEditing(true);
  const onClose = () => setEditing(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChange = (event: SyntheticEvent<Element, Event>, value: IMember | null) => {
    if (value) {
      if (value.id !== 'Unassigned') api.task.update({id, assignee: {ids: [value.id]}}).then(onSuccess);
      else api.task.update({id, assignee: {ids: []}}).then(onSuccess);
      onClose();
    }
  };

  return (
    <>
      {isEdting ? (
        <Autocomplete
          className={style['task-assignee']}
          disablePortal
          options={options}
          noOptionsText={'Searching...'}
          getOptionLabel={option => option.name}
          open={true}
          onChange={onChange}
          onBlur={onClose}
          sx={{minWidth: 240}}
          size="small"
          defaultValue={optionActive || options[0]}
          renderInput={params => <TextField {...params} placeholder="Search People" autoFocus />}
          renderOption={(props, option, {selected}) => {
            return (
              <Box component="li" {...props}>
                <div className="flex w-full items-center gap-x-2.5">
                  <AssigneeIcon name={option.name} bg={option.bg} />
                  <div className="name grow">{auth && auth.id === option.id ? 'Me' : option.name}</div>
                  <div className="active">{selected && <i className="ico-check text-base font-extrabold text-blue-700" />}</div>
                </div>
              </Box>
            );
          }}
        />
      ) : (
        <div className="assignee-user" onClick={onClick}>
          <AssigneeIcon name={optionActive?.name} bg={optionActive?.bg} />
        </div>
      )}
    </>
  );
};

export default TaskAssignee;