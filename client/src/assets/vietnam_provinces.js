const vietnamProvinces = [
  {
    code: '01',
    name: 'Hà Nội',
    districts: [
      {
        code: '001',
        name: 'Ba Đình',
        wards: [
          { code: '00001', name: 'Phúc Xá' },
          { code: '00004', name: 'Trúc Bạch' },
          { code: '00006', name: 'Vĩnh Phúc' },
          { code: '00007', name: 'Cống Vị' },
          { code: '00008', name: 'Liễu Giai' },
          { code: '00010', name: 'Nguyễn Trung Trực' },
          { code: '00013', name: 'Quán Thánh' },
          { code: '00016', name: 'Ngọc Hà' },
          { code: '00019', name: 'Điện Biên' },
          { code: '00022', name: 'Đội Cấn' },
          { code: '00025', name: 'Ngọc Khánh' },
          { code: '00028', name: 'Kim Mã' },
          { code: '00031', name: 'Giảng Võ' },
          { code: '00034', name: 'Thành Công' }
        ]
      },
      {
        code: '002',
        name: 'Hoàn Kiếm',
        wards: [
          { code: '00037', name: 'Phúc Tân' },
          { code: '00040', name: 'Đồng Xuân' },
          { code: '00043', name: 'Hàng Mã' },
          { code: '00046', name: 'Hàng Buồm' },
          { code: '00049', name: 'Hàng Đào' },
          { code: '00052', name: 'Hàng Bồ' },
          { code: '00055', name: 'Cửa Đông' },
          { code: '00058', name: 'Lý Thái Tổ' },
          { code: '00061', name: 'Hàng Bạc' },
          { code: '00064', name: 'Hàng Gai' },
          { code: '00067', name: 'Chương Dương' },
          { code: '00070', name: 'Hàng Trống' },
          { code: '00073', name: 'Cửa Nam' },
          { code: '00076', name: 'Hàng Bông' },
          { code: '00079', name: 'Tràng Tiền' },
          { code: '00082', name: 'Trần Hưng Đạo' },
          { code: '00085', name: 'Phan Chu Trinh' },
          { code: '00088', name: 'Hàng Bài' }
        ]
      },
      {
        code: '003',
        name: 'Tây Hồ',
        wards: [
          { code: '00091', name: 'Phú Thượng' },
          { code: '00094', name: 'Nhật Tân' },
          { code: '00097', name: 'Tứ Liên' },
          { code: '00100', name: 'Quảng An' },
          { code: '00103', name: 'Xuân La' },
          { code: '00106', name: 'Yên Phụ' },
          { code: '00109', name: 'Bưởi' },
          { code: '00112', name: 'Thụy Khuê' }
        ]
      }
    ]
  },
  {
    code: '79',
    name: 'Hồ Chí Minh',
    districts: [
      {
        code: '760',
        name: 'Quận 1',
        wards: [
          { code: '26734', name: 'Tân Định' },
          { code: '26737', name: 'Đa Kao' },
          { code: '26740', name: 'Bến Nghé' },
          { code: '26743', name: 'Bến Thành' },
          { code: '26746', name: 'Nguyễn Thái Bình' },
          { code: '26749', name: 'Phạm Ngũ Lão' },
          { code: '26752', name: 'Cầu Ông Lãnh' },
          { code: '26755', name: 'Cô Giang' },
          { code: '26758', name: 'Nguyễn Cư Trinh' },
          { code: '26761', name: 'Cầu Kho' }
        ]
      },
      {
        code: '761',
        name: 'Quận 2',
        wards: [
          { code: '26764', name: 'Thảo Điền' },
          { code: '26767', name: 'An Phú' },
          { code: '26770', name: 'Bình An' },
          { code: '26773', name: 'Bình Trưng Đông' },
          { code: '26776', name: 'Bình Trưng Tây' },
          { code: '26779', name: 'Bình Khánh' },
          { code: '26782', name: 'An Khánh' },
          { code: '26785', name: 'Cát Lái' },
          { code: '26788', name: 'Thạnh Mỹ Lợi' },
          { code: '26791', name: 'An Lợi Đông' },
          { code: '26794', name: 'Thủ Thiêm' }
        ]
      },
      {
        code: '762',
        name: 'Quận 3',
        wards: [
          { code: '26797', name: 'Tân Định' },
          { code: '26800', name: 'Đa Kao' },
          { code: '26803', name: 'Bến Nghé' },
          { code: '26806', name: 'Bến Thành' },
          { code: '26809', name: 'Nguyễn Thái Bình' },
          { code: '26812', name: 'Phạm Ngũ Lão' },
          { code: '26815', name: 'Cầu Ông Lãnh' },
          { code: '26818', name: 'Cô Giang' },
          { code: '26821', name: 'Nguyễn Cư Trinh' },
          { code: '26824', name: 'Cầu Kho' },
          { code: '26827', name: 'Nguyễn Thị Minh Khai' },
          { code: '26830', name: 'Nguyễn Thị Nghĩa' }
        ]
      },
      {
        code: '763',
        name: 'Quận 4',
        wards: [
          { code: '26833', name: 'Tân Thuận Đông' },
          { code: '26836', name: 'Tân Thuận Tây' },
          { code: '26839', name: 'Tân Kiểng' },
          { code: '26842', name: 'Tân Hưng' },
          { code: '26845', name: 'Bình Thuận' },
          { code: '26848', name: 'Tân Quy' },
          { code: '26851', name: 'Phú Thuận' },
          { code: '26854', name: 'Tân Phú' },
          { code: '26857', name: 'Tân Phong' },
          { code: '26860', name: 'Phú Mỹ' }
        ]
      },
      {
        code: '764',
        name: 'Quận 5',
        wards: [
          { code: '26863', name: 'Tân Định' },
          { code: '26866', name: 'Đa Kao' },
          { code: '26869', name: 'Bến Nghé' },
          { code: '26872', name: 'Bến Thành' },
          { code: '26875', name: 'Nguyễn Thái Bình' },
          { code: '26878', name: 'Phạm Ngũ Lão' },
          { code: '26881', name: 'Cầu Ông Lãnh' },
          { code: '26884', name: 'Cô Giang' },
          { code: '26887', name: 'Nguyễn Cư Trinh' },
          { code: '26890', name: 'Cầu Kho' },
          { code: '26893', name: 'Nguyễn Thị Minh Khai' },
          { code: '26896', name: 'Nguyễn Thị Nghĩa' },
          { code: '26899', name: 'Cầu Ông Lãnh' },
          { code: '26902', name: 'Cô Giang' },
          { code: '26905', name: 'Nguyễn Cư Trinh' }
        ]
      }
    ]
  },
  {
    code: '48',
    name: 'Đà Nẵng',
    districts: [
      {
        code: '490',
        name: 'Hải Châu',
        wards: [
          { code: '20134', name: 'Thạch Thang' },
          { code: '20137', name: 'Hải Châu I' },
          { code: '20140', name: 'Hải Châu II' },
          { code: '20143', name: 'Phước Ninh' },
          { code: '20146', name: 'Hòa Thuận Đông' },
          { code: '20149', name: 'Nam Dương' },
          { code: '20152', name: 'Bình Hiên' },
          { code: '20155', name: 'Bình Thuận' },
          { code: '20158', name: 'Hòa Cường Bắc' },
          { code: '20161', name: 'Hòa Cường Nam' }
        ]
      },
      {
        code: '491',
        name: 'Thanh Khê',
        wards: [
          { code: '20164', name: 'Thạc Gián' },
          { code: '20167', name: 'Hòa Khê' },
          { code: '20170', name: 'Tam Thuận' },
          { code: '20173', name: 'Thanh Khê Đông' },
          { code: '20176', name: 'Thanh Khê Tây' },
          { code: '20179', name: 'Xuân Hà' },
          { code: '20182', name: 'Tân Chính' },
          { code: '20185', name: 'Chính Gián' },
          { code: '20188', name: 'Vĩnh Trung' },
          { code: '20191', name: 'Thạc Gián' }
        ]
      }
    ]
  }
];

export default vietnamProvinces; 