import React, { useState, useEffect } from 'react';
import { Form, Select, Input } from 'antd';
import axios from 'axios';

const { Option } = Select;

const LocationPicker = ({ onLocationChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    axios.get('https://vapi.vnappmob.com/api/province/')
      .then(response => {
        setProvinces(response.data.results);
      })
      .catch(error => console.error('Error fetching provinces:', error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios.get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince}`)
        .then(response => {
          setDistricts(response.data.results);
        })
        .catch(error => console.error('Error fetching districts:', error));
    } else {
      setDistricts([]);
    }
    setWards([]);
    setSelectedDistrict('');
    setSelectedWard('');
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`https://vapi.vnappmob.com/api/province/ward/${selectedDistrict}`)
        .then(response => {
          setWards(response.data.results);
        })
        .catch(error => console.error('Error fetching wards:', error));
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (value) => {
    const provinceId = value;
    const provinceName = provinces.find(province => province.province_id === provinceId)?.province_name || '';
    setSelectedProvince(provinceId);
    onLocationChange({ provinceId, provinceName, districtName: '', wardName: '', details });
  };

  const handleDistrictChange = (value) => {
    const districtId = value;
    const districtName = districts.find(district => district.district_id === districtId)?.district_name || '';
    setSelectedDistrict(districtId);
    const provinceName = provinces.find(province => province.province_id === selectedProvince)?.province_name || '';
    onLocationChange({ provinceId: selectedProvince, provinceName, districtId, districtName, wardName: '', details });
  };

  const handleWardChange = (value) => {
    const wardId = value;
    const wardName = wards.find(ward => ward.ward_id === wardId)?.ward_name || '';
    setSelectedWard(wardId);
    const provinceName = provinces.find(province => province.province_id === selectedProvince)?.province_name || '';
    const districtName = districts.find(district => district.district_id === selectedDistrict)?.district_name || '';
    onLocationChange({ provinceId: selectedProvince, provinceName, districtId: selectedDistrict, districtName, wardId, wardName, details });
  };

  const handleDetailsChange = (e) => {
    const details = e.target.value;
    setDetails(details);
    const provinceName = provinces.find(province => province.province_id === selectedProvince)?.province_name || '';
    const districtName = districts.find(district => district.district_id === selectedDistrict)?.district_name || '';
    const wardName = wards.find(ward => ward.ward_id === selectedWard)?.ward_name || '';
    onLocationChange({ provinceId: selectedProvince, provinceName, districtId: selectedDistrict, districtName, wardId: selectedWard, wardName, details });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Tỉnh/Thành" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành!' }]}>
        <Select
          value={selectedProvince}
          onChange={handleProvinceChange}
          placeholder="Chọn Tỉnh/Thành"
        >
          {provinces.map(province => (
            <Option key={province.province_id} value={province.province_id}>{province.province_name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Quận/Huyện" rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện!' }]}>
        <Select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          placeholder="Chọn Quận/Huyện"
          disabled={!selectedProvince}
        >
          {districts.map(district => (
            <Option key={district.district_id} value={district.district_id}>{district.district_name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Phường/Xã" rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã!' }]}>
        <Select
          value={selectedWard}
          onChange={handleWardChange}
          placeholder="Chọn Phường/Xã"
          disabled={!selectedDistrict}
        >
          {wards.map(ward => (
            <Option key={ward.ward_id} value={ward.ward_id}>{ward.ward_name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Số nhà/Đường" rules={[{ required: true, message: 'Vui lòng nhập Số nhà/Đường!' }]}>
        <Input
          placeholder="Nhập số nhà/đường"
          value={details}
          onChange={handleDetailsChange}
        />
      </Form.Item>
    </Form>
  );
};

export default LocationPicker;