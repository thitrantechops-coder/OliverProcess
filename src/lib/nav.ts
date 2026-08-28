export type NavItem = { href: string; label: string };
export type NavGroup = { title: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    title: "Mở đầu",
    items: [
      { href: "#bia", label: "Trang bìa & hiệu lực" },
      { href: "#phap-ly", label: "Căn cứ pháp lý" },
      { href: "#nguyen-tac", label: "Nguyên tắc & phạm vi" },
    ],
  },
  {
    title: "Tiêu chuẩn",
    items: [
      { href: "#tieu-chuan", label: "Hệ thống tiêu chuẩn Oliver" },
      { href: "#to-chuc", label: "Tổ chức & năng lực" },
      { href: "#cong-nghe", label: "Ứng dụng công nghệ" },
    ],
  },
  {
    title: "Quy trình",
    items: [
      { href: "#ban-do", label: "Bản đồ quy trình" },
      { href: "#qt-hanh-chinh", label: "Pháp lý – hành chính" },
      { href: "#qt-nhansu", label: "Nhân sự" },
      { href: "#qt-cskh", label: "CSKH – lễ tân – cộng đồng" },
      { href: "#qt-anninh", label: "An ninh – ra vào – bãi xe" },
      { href: "#qt-kythuat", label: "Kỹ thuật – bảo trì – PCCC" },
      { href: "#qt-vesinh", label: "Vệ sinh – cảnh quan – tiện ích" },
      { href: "#qt-taichinh", label: "Tài chính – thu phí – báo cáo" },
      { href: "#qt-nhathau", label: "Nhà thầu phụ & thi công" },
    ],
  },
  {
    title: "KPI & kỷ luật",
    items: [
      { href: "#sla", label: "SLA – KPI" },
      { href: "#thuong-phat-nv", label: "Thưởng phạt nhân sự" },
      { href: "#thuong-phat-thau", label: "Thưởng phạt nhà thầu phụ" },
      { href: "#phu-luc", label: "Phụ lục pháp lý" },
    ],
  },
];
