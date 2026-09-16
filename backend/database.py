from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, Float, String, Text, Date, DateTime
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://imposter_users:imposter_password_2026@db:5432/imposter_db")
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(ASYNC_DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

class SocialObject(Base):
    __tablename__ = "social_objects"
    __table_args__ = {"schema": "map_build"}

    id = Column(Integer, primary_key=True)
    num = Column(Integer)
    grbs = Column(Text)
    oks_name = Column(Text)
    construction_stage = Column(Text)
    address = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    industry = Column(Text)
    status = Column(Text)
    ownership = Column(Text)
    amo = Column(Text)
    customer = Column(Text)
    np_gp_name = Column(Text)
    fp_name = Column(Text)
    project_code = Column(Text)
    total_area_m2 = Column(Float)
    capacity = Column(Text)
    expertise = Column(Text)
    year_start = Column(Integer)
    year_end = Column(Integer)
    construction_period = Column(Text)
    land_transfer_date = Column(Date)
    building_permit_date = Column(Date)
    contract_date = Column(Date)
    contract_period = Column(Text)
    contractor = Column(Text)
    construction_readiness = Column(Float)
    equipment_installation_date = Column(Date)
    hydro_test_date = Column(Date)
    zos_date = Column(Date)
    zos_number = Column(Text)
    act_input_date = Column(Date)
    act_input_number = Column(Text)
    year_commissioned = Column(Integer)
    photo_before = Column(Text)
    photo_after = Column(Text)

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "map_build"}

    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Builder(Base):
    __tablename__ = "builders"
    __table_args__ = {"schema": "map_build"}

    id = Column(Integer, primary_key=True)
    municipality = Column(Text)
    category = Column(Text)
    title = Column(Text, nullable=False)
    address = Column(Text)
    longitude = Column(Float)
    latitude = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
