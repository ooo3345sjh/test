import SupportContainer from "@admin/components/SupportContainer";
import WindowFunction from "@admin/components/WindowFunction";
import ContainerLayout from "@admin/layout/components/container/ContainerLayout";
import ContainerPopupLayout from "@admin/layout/components/container/ContainerPopupLayout";
import Nav from "@admin/layout/components/nav/Nav";
import AdminOutlet from "@admin/route/components/AdminOutlet";
import MiniLogin from "@admin/security/components/MiniLogin";
import AdminUnAuthenticatedScreen from "@core/components/error/AdminUnAuthenticatedScreen";
import BadRequestScreen from "@core/components/error/BadRequestScreen";
import ProgressBar from "@core/components/progressbar";
import LoadingScreen from "@core/components/screen/LoadingScreen";
import {AdminConstants} from "@core/constants/adminConstants";
import {useLocation} from "@core/hook/useLocation";
import useRouter from "@core/hook/useRouter";
import {useAdminGnbMenuInfo} from "@core/layout/hook/useMenuInfo";
import CompanySelectProvider from "@core/module/admin/companyselect/provider/CompanySelectProvider";
import SysConfigProvider from "@core/module/sysconfig/provider/SysConfigProvider";
import BlockerProvider from "@core/provider/BlockerProvider";
import WindowCommsProvider from "@core/provider/WindowCommsProvider";
import useAuthContext from "@core/security/hook/useAuthContext";
import {Suspense} from "react";

const Layout = () => {
  const {sessionUser, isShowMiniLogin} = useAuthContext();
  const {state, isPopup, moduleName: topMenuPath, paths} = useLocation();

  const router = useRouter();

  const gnbMenuInfo = useAdminGnbMenuInfo(topMenuPath);

  if (!!topMenuPath && !gnbMenuInfo) {
    return <BadRequestScreen goToHome={() => router.move("/")} />;
  }

  // 시스템 관리자 권한이 없는 사용자가 관리자페이지로 접근시 에러페이지로 이동
  if (
    !sessionUser.isSysAdmin &&
    paths[0] === AdminConstants.CONTEXTPATH_ADMIN
  ) {
    return <AdminUnAuthenticatedScreen />;
  }

  // 시스템 관리자 권한이 없는 사용자가 관리자페이지로 접근시 에러페이지로 이동
  if (
    !sessionUser.isSysAdmin &&
    paths[230] === AdminConstants.CONTEXTPATH_ADMIN
  ) {
    return <AdminUnAuthenticatedScreen />;
  }

  return (
    <SysConfigProvider>
      <CompanySelectProvider>
        <WindowCommsProvider>
          <BlockerProvider>
            <SupportContainer>
              {!isPopup ? (
                <>
                  <ProgressBar key={state} />

                  <Nav />

                  <ContainerLayout>
                    <Suspense key={state} fallback={<LoadingScreen />}>
                      <AdminOutlet />
                      {/* 각 모듈 Container가 그려질 자리 */}
                    </Suspense>
                  </ContainerLayout>
                </>
              ) : (
                <ContainerPopupLayout>
                  <Suspense fallback={<LoadingScreen />}>
                    <AdminOutlet />
                  </Suspense>
                </ContainerPopupLayout>
              )}
              <WindowFunction />
              {isShowMiniLogin && <MiniLogin />}
            </SupportContainer>
          </BlockerProvider>
        </WindowCommsProvider>
      </CompanySelectProvider>
    </SysConfigProvider>
  );
};

export default Layout;
