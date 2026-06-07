import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface EmailSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmailSearchInput({ value, onChange }: EmailSearchInputProps) {
  return (
    <TextField
      size="small"
      placeholder="Search emails…"
      value={value}
      onChange={(event) => onChange(event.target.value)}
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
              onClick={() => onChange('')}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}
