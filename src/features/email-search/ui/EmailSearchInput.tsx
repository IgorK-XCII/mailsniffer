import { memo, useCallback } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

type EmailSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const EmailSearchInput = memo(
  ({ value, onChange }: EmailSearchInputProps) => {
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
      [onChange],
    );
    const handleClear = useCallback(() => onChange(''), [onChange]);

    return (
      <TextField
        size="small"
        placeholder="Search emails…"
        value={value}
        onChange={handleChange}
        fullWidth
        inputProps={{ 'aria-label': 'search emails' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="clear search"
                onClick={handleClear}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    );
  },
);
