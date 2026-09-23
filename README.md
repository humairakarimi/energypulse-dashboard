# OpsInsight — Phase 1 Sample Data

This starter generates fictional operational records for the OpsInsight
portfolio project. The values are for software demonstration only; they are
not real company data or engineering and safety standards.

## Run it

```bash
python3 generate_sample_data.py
```

The script writes two files into `data/`:

- `sample_valid_data.csv`: 300 structurally valid records (five facilities for
  60 days). Valid rows may still describe Normal, Warning, or Critical operating
  conditions.
- `sample_invalid_data.csv`: 12 deliberately bad rows for testing validation,
  including missing values, future dates, unknown facilities, impossible hours,
  non-numeric values, and a duplicate.

## Record fields

| Field | Meaning |
| --- | --- |
| `record_date` | Date of the operational record |
| `facility_code` | Unique facility identifier |
| `production_volume` | Fictional daily production units |
| `operating_hours` | Hours operating during the day |
| `downtime_hours` | Hours unavailable during the day |
| `pressure_kpa` | Fictional pressure reading |
| `temperature_c` | Fictional temperature reading |
| `notes` | Short operational comment |

The next phase of the project will design the pages and dashboard. Validation
logic will be implemented later in FastAPI and Pandas.
