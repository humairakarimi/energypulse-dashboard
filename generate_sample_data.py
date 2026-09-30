"""Generate synthetic operational data for the EnergyPulse portfolio project.

The values in this file are fictional demonstration values. They are not
engineering or safety standards and must not be used for real operations.
"""

from __future__ import annotations

import csv
import random
from datetime import date, timedelta
from pathlib import Path


OUTPUT_DIRECTORY = Path(__file__).parent / "data"
RANDOM_SEED = 433
NUMBER_OF_DAYS = 60


FACILITIES = [
    {
        "facility_code": "NSF-001",
        "facility_name": "North Field Processing Facility",
        "location": "Grande Prairie, AB",
        "facility_type": "Gas Processing Facility",
        "production_target": 1200,
        "minimum_pressure": 140,
        "maximum_pressure": 190,
        "minimum_temperature": 50,
        "maximum_temperature": 85,
    },
    {
        "facility_code": "RDR-002",
        "facility_name": "Red Deer Compression Station",
        "location": "Red Deer, AB",
        "facility_type": "Compression Station",
        "production_target": 950,
        "minimum_pressure": 130,
        "maximum_pressure": 180,
        "minimum_temperature": 45,
        "maximum_temperature": 80,
    },
    {
        "facility_code": "CLG-003",
        "facility_name": "Calgary Processing Plant",
        "location": "Calgary, AB",
        "facility_type": "Gas Processing Facility",
        "production_target": 1500,
        "minimum_pressure": 150,
        "maximum_pressure": 205,
        "minimum_temperature": 50,
        "maximum_temperature": 90,
    },
    {
        "facility_code": "MTV-004",
        "facility_name": "Mountain View Gathering Facility",
        "location": "Cochrane, AB",
        "facility_type": "Gathering Facility",
        "production_target": 800,
        "minimum_pressure": 120,
        "maximum_pressure": 170,
        "minimum_temperature": 40,
        "maximum_temperature": 75,
    },
    {
        "facility_code": "STF-005",
        "facility_name": "South Field Processing Facility",
        "location": "Lethbridge, AB",
        "facility_type": "Gas Processing Facility",
        "production_target": 1050,
        "minimum_pressure": 135,
        "maximum_pressure": 185,
        "minimum_temperature": 45,
        "maximum_temperature": 82,
    },
]


FIELDNAMES = [
    "record_date",
    "facility_code",
    "production_volume",
    "operating_hours",
    "downtime_hours",
    "pressure_kpa",
    "temperature_c",
    "notes",
]


def create_valid_record(facility: dict, record_date: date) -> dict:
    """Create one structurally valid record with realistic variation."""

    condition = random.choices(
        ["normal", "warning", "critical"],
        weights=[78, 17, 5],
        k=1,
    )[0]

    target = facility["production_target"]

    if condition == "normal":
        production = random.uniform(target * 0.82, target * 1.08)
        downtime = random.uniform(0, 3.5)
        pressure = random.uniform(
            facility["minimum_pressure"], facility["maximum_pressure"]
        )
        temperature = random.uniform(
            facility["minimum_temperature"], facility["maximum_temperature"]
        )
        notes = "Routine operation"
    elif condition == "warning":
        production = random.uniform(target * 0.55, target * 0.78)
        downtime = random.uniform(4.5, 7.5)
        pressure = facility["minimum_pressure"] - random.uniform(1, 8)
        temperature = random.uniform(
            facility["minimum_temperature"], facility["maximum_temperature"]
        )
        notes = "Reduced output; review recommended"
    else:
        production = random.uniform(target * 0.25, target * 0.48)
        downtime = random.uniform(8, 14)
        pressure = facility["minimum_pressure"] - random.uniform(12, 25)
        temperature = facility["maximum_temperature"] + random.uniform(8, 18)
        notes = "Major interruption; investigation required"

    operating_hours = 24 - downtime

    return {
        "record_date": record_date.isoformat(),
        "facility_code": facility["facility_code"],
        "production_volume": round(production, 2),
        "operating_hours": round(operating_hours, 2),
        "downtime_hours": round(downtime, 2),
        "pressure_kpa": round(pressure, 2),
        "temperature_c": round(temperature, 2),
        "notes": notes,
    }


def create_valid_records() -> list[dict]:
    """Create 60 days of records for each of the five facilities."""

    first_day = date(2026, 7, 1)
    records = []

    for day_offset in range(NUMBER_OF_DAYS):
        record_date = first_day + timedelta(days=day_offset)

        for facility in FACILITIES:
            records.append(create_valid_record(facility, record_date))

    return records


def create_invalid_records(valid_records: list[dict]) -> list[dict]:
    """Create deliberate errors that our future validator must reject."""

    examples = []

    def changed_record(index: int, **changes: object) -> dict:
        record = valid_records[index].copy()
        record.update(changes)
        return record

    examples.append(changed_record(0, record_date=""))
    examples.append(changed_record(1, record_date="2035-01-01"))
    examples.append(changed_record(2, facility_code="UNKNOWN-999"))
    examples.append(changed_record(3, production_volume=""))
    examples.append(changed_record(4, production_volume=-125))
    examples.append(changed_record(5, operating_hours=25))
    examples.append(changed_record(6, downtime_hours=-2))
    examples.append(changed_record(7, operating_hours=20, downtime_hours=8))
    examples.append(changed_record(8, pressure_kpa="not-a-number"))
    examples.append(changed_record(9, temperature_c=""))

    duplicate = valid_records[10].copy()
    examples.append(duplicate)
    examples.append(duplicate.copy())

    return examples


def write_csv(path: Path, records: list[dict]) -> None:
    """Write a list of record dictionaries to a CSV file."""

    with path.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(records)


def main() -> None:
    """Generate both Phase 1 datasets."""

    random.seed(RANDOM_SEED)
    OUTPUT_DIRECTORY.mkdir(exist_ok=True)

    valid_records = create_valid_records()
    invalid_records = create_invalid_records(valid_records)

    write_csv(OUTPUT_DIRECTORY / "sample_valid_data.csv", valid_records)
    write_csv(OUTPUT_DIRECTORY / "sample_invalid_data.csv", invalid_records)

    print(f"Created {len(valid_records)} valid records.")
    print(f"Created {len(invalid_records)} deliberately invalid records.")


if __name__ == "__main__":
    main()
