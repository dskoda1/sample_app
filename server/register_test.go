package server

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/dskoda1/sample-app/server/db"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"

	"github.com/labstack/echo"
)

var (
	userJSON = `{"username":"heisenberg","password":"abc123"}`
)

func getTestSetup(body string) (echo.Context, *httptest.ResponseRecorder) {
	e := echo.New()
	req := httptest.NewRequest(echo.POST, "/", strings.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	return c, rec
}

func Test_RegisterSuccess(t *testing.T) {
	// GIVEN
	c, rec := getTestSetup(`{"username":"heisenberg","password":"abc123"}`)
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	userRepoMock := db.NewMockUserRepository(ctrl)
	passwordHasherMock := NewMockPasswordHasher(ctrl)

	userRepoMock.EXPECT().Insert(&db.User{Username: "heisenberg"})
	passwordHasherMock.EXPECT().Hash("abc123")

	// WHEN
	handler := Register(userRepoMock, passwordHasherMock)
	handler(c)

	// THEN
	assert.Equal(t, http.StatusCreated, rec.Code)
}

func Test_RegisterFailsToBindRequest(t *testing.T) {
	// GIVEN
	c, rec := getTestSetup(``)
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	userRepoMock := db.NewMockUserRepository(ctrl)
	passwordHasherMock := NewMockPasswordHasher(ctrl)

	// WHEN
	handler := Register(userRepoMock, passwordHasherMock)
	handler(c)

	// THEN
	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func Test_RegisterUserPasswordHashingError(t *testing.T) {
	// GIVEN
	c, rec := getTestSetup(`{"username":"heisenberg","password":""}`)
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	userRepoMock := db.NewMockUserRepository(ctrl)
	passwordHasherMock := NewMockPasswordHasher(ctrl)

	passwordHasherMock.EXPECT().Hash("").Return("", errors.New("ERROR"))

	// WHEN
	handler := Register(userRepoMock, passwordHasherMock)
	handler(c)

	// THEN
	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func Test_RegisterCallToInsertFails(t *testing.T) {
	// GIVEN
	c, rec := getTestSetup(`{"username": "heisenberg", "password": "abc123"}`)
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	userRepoMock := db.NewMockUserRepository(ctrl)
	passwordHasherMock := NewMockPasswordHasher(ctrl)

	passwordHasherMock.EXPECT().Hash("abc123").Return("hashed", nil)
	userRepoMock.EXPECT().Insert(gomock.Any()).Return(errors.New("ERROR"))

	// WHEN
	handler := Register(userRepoMock, passwordHasherMock)
	handler(c)

	// THEN
	assert.Equal(t, http.StatusConflict, rec.Code)
}